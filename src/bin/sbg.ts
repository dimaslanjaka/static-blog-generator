#!/usr/bin/env node

// compiled location in dist/src/bin/sbg.js

import yargs from 'yargs';
import gulp from '../../gulpfile';

const argv = yargs(process.argv.slice(2)).argv;
const tasks = argv['_'];

//console.log(getConfig().verbose, getConfig().generator.cache);
//console.log(argv['paths']);

gulp.series(...tasks)(null);

/*
function _loop_method() {
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
      taskswrapper[0](null);
      taskswrapper.shift();
    } else {
      keeprunning = false;
    }
  }
}
*/
