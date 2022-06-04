#!/usr/bin/env node

import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).argv;
console.log(argv);
