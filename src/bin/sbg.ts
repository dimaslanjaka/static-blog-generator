#!/usr/bin/env node

import { TaskFunctionWrapped } from 'undertaker';
import yargs from 'yargs';
import gulp from '../../gulpfile';

const argv = yargs(process.argv.slice(2)).argv;
const tasks = argv['_'];

//console.log(getConfig().verbose, getConfig().generator.cache);

const taskswrapper: TaskFunctionWrapped[] = [];
for (let i = 0; i < tasks.length; i++) {
  const taskname = tasks[i];
  const taskfn = gulp.task(taskname);
  //console.log('typeof task', taskname, typeof taskfn);
  if (typeof taskfn == 'function') {
    taskswrapper.push(taskfn);
  }
}

let keeprunning = true;
while (keeprunning !== false) {
  if (taskswrapper.length > 0) {
    const fn = taskswrapper[0];
    taskswrapper.shift();
    if (taskswrapper.length > 0) {
      fn(() => taskswrapper[0](null));
      taskswrapper.shift();
    } else {
      keeprunning = false;
    }
  } else {
    keeprunning = false;
  }
}
