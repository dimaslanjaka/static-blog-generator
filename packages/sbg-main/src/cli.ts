#!/usr/bin/env node

import yargs from "yargs";

yargs
  .scriptName('sbg')
  .usage('usage: sbg <command>')
  .command(
    '$0',
    'the default command',
    () => {},
    () => {
      yargs.showHelp();
    }
  )