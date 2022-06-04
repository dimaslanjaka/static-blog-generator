#!/usr/bin/env node

import gulp from 'gulp';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).argv;
const tasks = argv['_'];

//console.log(getConfig().verbose, getConfig().generator.cache);

for (let i = 0; i < tasks.length; i++) {
  const task = tasks[i];

  const fn = gulp.series(task);
  console.log(typeof fn);
}
