#!/usr/bin/env node

import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).argv;
const tasks = argv['_'];

console.log(tasks);
