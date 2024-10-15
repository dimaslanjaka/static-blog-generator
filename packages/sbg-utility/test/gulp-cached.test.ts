import { beforeAll, describe, test } from '@jest/globals';
import gulp from 'gulp';
import url from 'node:url';
import path from 'path';
import defaults, { gulpOpt } from '../src';
import { fetchConfig } from '../src/config/_config';
import findYarnRootWorkspace from '../src/utils/nodeWorkspaceHelper';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('gulp cache', () => {
  const cwd = path.resolve(String(findYarnRootWorkspace({ base_dir: path.join(__dirname, '..') })), 'test');
  beforeAll(() => {
    fetchConfig(cwd);
  });

  test('gulpCached()', (done) => {
    gulp
      .src('**/*', { cwd: path.join(__dirname, '/../src') } as gulpOpt)
      .pipe(defaults.gulpCached({ name: 'test', verbose: true }))
      .pipe(gulp.dest(path.join(__dirname, '/../tmp/dest')))
      .once('end', () => done());
  }, 70000);
});
