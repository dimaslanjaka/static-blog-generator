#!/usr/bin/env node

import Hexo from 'hexo';
import { stdin as process_input, stdout as process_output } from 'node:process';
import * as readline from 'node:readline/promises';
import SBGServer from 'sbg-server';
import path from 'upath';
import yargs from 'yargs';
import { getApi, rootColor } from './env';

const api = getApi();

yargs
  .scriptName('sbg')
  .usage('usage: sbg <command>')
  .command(
    '$0',
    'the default command',
    () => {
      // console.log('default command');
    },
    () => {
      yargs.showHelp();
    }
  )
  .command(
    'view',
    'view all configurations',
    function () {
      console.log(rootColor, api.cwd);
      console.log('source post dir    ', `${rootColor}/${api.config.post_dir}`);
      console.log('source dir         ', `${rootColor}/${api.config.source_dir}`);
      console.log('generated post dir ', `${rootColor}/${api.config.source_dir}/_posts`);
    },
    function () {
      //
    }
  )
  .command(
    'clean [key]',
    'clean commands',
    function (yargs) {
      yargs.positional(`db`, {
        type: `string`,
        describe: `clean ${rootColor}/tmp`
      });
      yargs.positional(`post`, {
        type: `string`,
        describe: `clean ${rootColor}/${api.config.source_dir}/_posts`
      });
      yargs.positional(`archive`, {
        type: `string`,
        describe: `clean categories, tags, archives inside ${rootColor}/.deploy_${api.config.deploy.type || 'git'}`
      });
      yargs.positional(`all`, {
        type: `string`,
        describe: `clean categories, tags, archives, generated posts, caches`
      });
    },
    async function ({ key }) {
      if (!key) {
        const rl = readline.createInterface({ input: process_input, output: process_output });
        const answer = await rl.question('Clean all caches? y/yes/n/no: ');
        if (answer === 'yes' || answer === 'y') {
          await api.clean('all');
        } else {
          console.log('clean aborted');
        }
        rl.close();
      } else {
        switch (key) {
          case 'db':
            await api.clean('database');
            break;

          case 'post':
            await api.clean('post');
            break;
          case 'archive':
            await api.clean('archive');
            break;
          case 'all':
            await api.clean('all');
            break;
        }
      }
    }
  )
  .command(
    'post <key>',
    `operation inside ${rootColor}/${api.config.post_dir}`,
    function (yargs) {
      yargs.positional(`copy`, {
        type: `string`,
        describe: `copy ${rootColor}/${api.config.post_dir} to ${rootColor}/${api.config.source_dir}/_posts`
      });
      yargs.positional(`standalone`, {
        type: `string`,
        describe: `run all *.standalone.js inside ${rootColor}/${api.config.post_dir}`
      });
    },
    async function ({ key }) {
      if (key) {
        if (key === 'copy') {
          await api.copy();
        } else if (key === 'standalone') {
          await api.standalone();
        }
      } else {
        yargs.showHelp();
      }
    }
  )
  .command(
    'generate <key>',
    `operation inside ${rootColor}/${api.config.public_dir}`,
    function (yargs) {
      yargs.positional(`seo`, {
        type: `string`,
        describe: `fix seo after generate site`
      });
      yargs.positional(`safelink`, {
        type: `string`,
        describe: `anonymize external links after generate site`
      });
      yargs.positional(`hexo`, {
        type: `string`,
        describe: `generate site with hexo`
      });
    },
    async function ({ key }) {
      const hexo = new Hexo(api.cwd);
      switch (key) {
        case 'seo':
          await api.seo(path.join(api.config.cwd, api.config.public_dir));
          break;

        case 'safelink':
          await api.safelink(path.join(api.config.cwd, api.config.public_dir));
          break;

        case 'hexo':
          await hexo.init();
          await hexo.load();
          await hexo.call('generate');
          break;
      }
    }
  )
  .command(
    'deploy <key>',
    `operation inside ${rootColor}/.deploy_${api.config.deploy?.type || 'git'}`,
    function (yargs) {
      yargs.positional(`seo`, {
        type: `string`,
        describe: `fix seo`
      });
      yargs.positional(`safelink`, {
        type: `string`,
        describe: `anonymize external links`
      });
      yargs.positional(`feed`, {
        type: `string`,
        describe: `generate feed`
      });
      yargs.positional(`sitemap`, {
        type: `string`,
        describe: `generate sitemap`
      });
      yargs.positional(`copy`, {
        type: `string`,
        describe: `copy generated files to deployment directory`
      });
    },
    async function ({ key }) {
      switch (key) {
        case 'seo':
          await api.seo(path.join(api.config.cwd, `/.deploy_${api.config.deploy?.type || 'git'}`));
          break;

        case 'safelink':
          await api.safelink(path.join(api.config.cwd, `/.deploy_${api.config.deploy?.type || 'git'}`));
          break;

        case 'copy':
          await api.deploy.copy();
          break;
      }
    }
  )
  .command(
    'server',
    'start server manager',
    function (yargs) {
      yargs.option('p', {
        alias: 'port',
        demandOption: true,
        default: 4000,
        describe: 'specify port, default 4000',
        type: 'number'
      }).argv;
    },
    function ({ p, port }) {
      const serv = new SBGServer({ root: api.cwd, port: parseInt(String(p || port || 4000)) });
      serv.start();
    }
  )
  .help('help')
  .alias('help', 'h')
  .alias('help', '?')
  .wrap(null).argv;
