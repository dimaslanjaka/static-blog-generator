import { beforeAll, describe, test } from '@jest/globals';
import fs from 'fs';
import gulp from 'gulp';
import url from 'node:url';
import path from 'path';
import { fetchConfig as fetchConfigDist } from '../../dist/config/_config';
import defaultsDist, { gulpOpt as gulpOptDist } from '../../dist/index';
import { fetchConfig as fetchConfigSrc } from '../../src/config/_config';
import defaultsSrc, { gulpOpt as gulpOptSrc } from '../../src/index';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('gulp cache (src)', () => {
  const projectRoot = path.resolve(__dirname, '../../');
  const destDir = path.join(projectRoot, 'tmp/dest-src');
  const cwd = path.join(projectRoot, 'test');
  process.cwd = () => cwd;

  beforeAll(() => {
    fetchConfigSrc(cwd);
  });

  test('gulpCached() with src', (done) => {
    gulp
      .src('**/*', { cwd: path.join(projectRoot, 'src') } as gulpOptSrc)
      .pipe(defaultsSrc.gulpCached({ name: 'test', verbose: true }))
      .pipe(gulp.dest(destDir))
      .once('end', () => {
        fs.readdir(destDir, (err: NodeJS.ErrnoException | null, files: string[]) => {
          expect(err).toBeNull();
          expect(Array.isArray(files)).toBe(true);
          expect(files.length).toBeGreaterThan(0);
          done();
        });
      });
  }, 70000);
});

describe('gulp cache (dist)', () => {
  const projectRoot = path.resolve(__dirname, '../../');
  const destDir = path.join(projectRoot, 'tmp/dest-dist');
  const cwd = path.join(projectRoot, 'test');
  process.cwd = () => cwd;

  beforeAll(() => {
    fetchConfigDist(cwd);
  });

  test('gulpCached() with dist', (done) => {
    gulp
      .src('**/*', { cwd: path.join(projectRoot, 'src') } as gulpOptDist)
      .pipe(defaultsDist.gulpCached({ name: 'test', verbose: true }))
      .pipe(gulp.dest(destDir))
      .once('end', () => {
        fs.readdir(destDir, (err: NodeJS.ErrnoException | null, files: string[]) => {
          expect(err).toBeNull();
          expect(Array.isArray(files)).toBe(true);
          expect(files.length).toBeGreaterThan(0);
          done();
        });
      });
  }, 70000);
});
