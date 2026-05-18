const { chain } = require('../../dist/index.cjs');
const gulp = require('gulp');
const path = require('path');

const cwd = path.join(process.cwd(), 'test/fixtures');
const dest = path.join(process.cwd(), 'tmp/fixtures');
const gulpProcess = () =>
  gulp
    .src('**/*.*', { cwd })
    .pipe(gulp.dest(dest))
    .once('end', () => console.log('stream done'));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

chain([
  { callback: gulpProcess },
  {
    callback: async () => {
      await sleep(5000);
      console.log('async done');
    }
  }
]);
