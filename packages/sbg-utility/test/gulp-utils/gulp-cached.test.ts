import { beforeAll, describe, test } from '@jest/globals';
import fs from 'fs';
import gulp from 'gulp';
import url from 'node:url';
import path from 'path';
import defaults, { gulpOpt } from '../../src';
import { fetchConfig } from '../../src/config/_config';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('gulp cache', () => {
  // Adjust base_dir to point to the project root
  const projectRoot = path.resolve(__dirname, '../../');
  const cwd = path.join(projectRoot, 'test');
  beforeAll(() => {
    fetchConfig(cwd);
  });

  test('gulpCached()', (done) => {
    const destDir = path.join(projectRoot, 'tmp/dest');
    gulp
      .src('**/*', { cwd: path.join(projectRoot, 'src') } as gulpOpt)
      .pipe(defaults.gulpCached({ name: 'test', verbose: true }))
      .pipe(gulp.dest(destDir))
      .once('end', () => {
        // Check that destination directory contains files
        fs.readdir(destDir, (err: NodeJS.ErrnoException | null, files: string[]) => {
          expect(err).toBeNull();
          expect(Array.isArray(files)).toBe(true);
          expect(files.length).toBeGreaterThan(0);
          done();
        });
      });
  }, 70000);
});
