#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { spawnAsync } from 'cross-spawn';
import fs from 'fs-extra';
import { stdin as process_input, stdout as process_output } from 'node:process';
import * as readline from 'node:readline';
import { feed, sitemap } from 'sbg-api';
import SBGServer from 'sbg-server';
import path from 'upath';
import YARGS from 'yargs';
import { getApi, rootColor } from './env';

const api = getApi();

const yargs = YARGS(process.argv.slice(2));
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
  // view all configs command
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
  // clean commands
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
        const answer = await new Promise((resolve: (resultInput: string) => any) => {
          rl.question('Clean all caches? y/yes/n/no: ', (input) => {
            rl.close();
            resolve(input);
          });
        });
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
  // process source posts
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
      yargs.positional(`images`, {
        type: `string`,
        describe: `finding broken images inside ${rootColor}/${api.config.post_dir}`
      });
    },
    async function ({ key }) {
      if (key) {
        if (key === 'copy') {
          await api.copy();
        } else if (key === 'standalone') {
          await api.standalone();
        } else if (key === 'images') {
          await api.findBrokenImages();
        }
      } else {
        yargs.showHelp();
      }
    }
  )
  // process generated static html
  .command(
    'generate <key>',
    `generate operation on ${rootColor}/${api.config.public_dir}`,
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
      yargs.positional(`feed`, {
        type: `string`,
        describe: `generate feed on ${rootColor}/${api.config.public_dir}`
      });
      yargs.positional(`sitemap`, {
        type: `string`,
        describe: `generate sitemap on ${rootColor}/${api.config.public_dir}`
      });
    },
    async function ({ key }) {
      switch (key) {
        case 'seo':
          await api.seo(path.join(api.config.cwd, api.config.public_dir));
          break;

        case 'safelink':
          await api.safelink(path.join(api.config.cwd, api.config.public_dir));
          break;

        case 'feed':
          if (!fs.existsSync(path.join(api.config.cwd, api.config.public_dir))) {
            console.log(`site not yet generated, please using 'sbg generate hexo' to generate site.`);
            return;
          }
          await feed.hexoGenerateFeed(undefined, api.config);
          break;

        case 'sitemap':
          if (!fs.existsSync(path.join(api.config.cwd, api.config.public_dir))) {
            console.log(`site not yet generated, please using 'sbg generate hexo' to generate site.`);
            return;
          }
          await sitemap.hexoGenerateSitemap(api.config);
          break;

        case 'hexo':
          console.log('generating site', api.cwd);
          await spawnAsync('npx', ['hexo', 'generate'], { cwd: api.cwd, stdio: 'inherit', shell: true });
          break;
      }
    }
  )
  // deployment
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
          await api.deploy.copy({
            config: api.config,
            cwd: api.cwd
          });
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
