#!/usr/bin/env node

import ansiColors from 'ansi-colors';
import { stdin as process_input, stdout as process_output } from 'node:process';
import * as readline from 'node:readline/promises';
import { Application } from 'sbg-api';
import path from 'upath';
import yargs from 'yargs';

const api = new Application(process.cwd());
const rootColor = ansiColors.bgYellowBright.black('<root>');

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
        describe: `fix seo`
      });
      yargs.positional(`safelink`, {
        type: `string`,
        describe: `anonymize external links`
      });
    },
    async function ({ key }) {
      if (key === 'seo') {
        await api.seo(path.join(api.config.cwd, api.config.public_dir));
      } else if (key === 'safelink') {
        await api.safelink(path.join(api.config.cwd, api.config.public_dir));
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
      yargs.positional(`copy`, {
        type: `string`,
        describe: `copy generated files to deployment directory`
      });
    },
    async function ({ key }) {
      if (key === 'seo') {
        await api.seo(path.join(api.config.cwd, `/.deploy_${api.config.deploy?.type || 'git'}`));
      } else if (key === 'safelink') {
        await api.safelink(path.join(api.config.cwd, `/.deploy_${api.config.deploy?.type || 'git'}`));
      } else if (key === 'copy') {
        //
      }
    }
  )
  .help('help')
  .alias('help', 'h')
  .alias('help', '?')
  .wrap(null).argv;
