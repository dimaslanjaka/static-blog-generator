#!/usr/bin/env node

import ansiColors from 'ansi-colors';
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
