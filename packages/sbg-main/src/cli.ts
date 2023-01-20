#!/usr/bin/env node

import ansiColors from 'ansi-colors';
import { Application } from 'sbg-api';
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
    (yargs) => {
      yargs.positional(`copy`, {
        type: `string`,
        describe: `copy ${rootColor}/${api.config.post_dir} to ${rootColor}/${api.config.source_dir}/_posts`
      });
    },
    async ({ key }) => {
      console.log(key);
    }
  )
  .help('help')
  .alias('help', 'h')
  .alias('help', '?')
  .wrap(null).argv;
