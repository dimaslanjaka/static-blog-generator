import { beforeAll, describe, test } from '@jest/globals';
import fs from 'fs';
import gulp from 'gulp';
import url from 'node:url';
import path from 'path';
import { fetchConfig as fetchConfigDist } from '../../dist/config/_config.mjs';
import defaultsDist from '../../dist/index.mjs';
import { fetchConfig as fetchConfigSrc } from '../../src/config/_config';
import defaultsSrc from '../../src/index';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function runGulpCacheTest(
  label: string,
  opts: {
    fetchConfig: (cwd: string) => void;
    defaults: { gulpCached: (options: { name: string; verbose: boolean }) => NodeJS.ReadWriteStream };
    destDir: string;
  }
) {
  describe(label, () => {
    const projectRoot = path.resolve(__dirname, '../../');
    const cwd = path.join(projectRoot, 'test');
    process.cwd = () => cwd;

    beforeAll(() => {
      opts.fetchConfig(cwd);
    });

    test('gulpCached() works', (done) => {
      gulp
        .src('**/*', { cwd: path.join(projectRoot, 'src') })
        .pipe(opts.defaults.gulpCached({ name: 'test', verbose: true }))
        .pipe(gulp.dest(opts.destDir))
        .once('end', () => {
          fs.readdir(opts.destDir, (err: NodeJS.ErrnoException | null, files: string[]) => {
            expect(err).toBeNull();
            expect(Array.isArray(files)).toBe(true);
            expect(files.length).toBeGreaterThan(0);
            done();
          });
        });
    }, 70000);
  });
}

const projectRoot = path.resolve(__dirname, '../../');
runGulpCacheTest('gulp cache (src)', {
  fetchConfig: fetchConfigSrc,
  defaults: defaultsSrc,
  destDir: path.join(projectRoot, 'tmp/dest-src')
});

runGulpCacheTest('gulp cache (dist)', {
  fetchConfig: fetchConfigDist,
  defaults: defaultsDist,
  destDir: path.join(projectRoot, 'tmp/dest-dist')
});
