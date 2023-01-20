#!/usr/bin/env node

import yargs from 'yargs';

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
  .help('help')
  .alias('help', 'h')
  .alias('help', '?')
  .wrap(null).argv;
