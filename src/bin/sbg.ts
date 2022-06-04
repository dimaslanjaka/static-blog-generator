#!/usr/bin/env node

import yargs from 'yargs';
import gulp from '../../gulpfile';

const argv = yargs(process.argv.slice(2)).argv;
const tasks = argv['_'];

//console.log(getConfig().verbose, getConfig().generator.cache);

for (let i = 0; i < tasks.length; i++) {
  const taskname = tasks[i];
  const taskfn = gulp.task(taskname);
  console.log(typeof taskfn);
}
