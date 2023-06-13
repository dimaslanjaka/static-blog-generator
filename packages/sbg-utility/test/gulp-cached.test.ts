import { beforeAll, describe, test } from '@jest/globals';
import gulp from 'gulp';
import { join, resolve } from 'path';
import defaults, { gulpOpt } from '../src';

describe('gulp cache', () => {
  const cwd = resolve(String(defaults.findYarnRootWorkspace({ base_dir: join(__dirname, '..') })), 'test');
  beforeAll(() => {
    defaults.fetchConfig(cwd);
  });

  test('gulpCached()', (done) => {
    gulp
      .src('**/*', { cwd: join(__dirname, '/../src') } as gulpOpt)
      .pipe(defaults.gulpCached({ name: 'test', verbose: true }))
      .pipe(gulp.dest(join(__dirname, '/../tmp/dest')))
      .once('end', () => done());
  }, 70000);
});
