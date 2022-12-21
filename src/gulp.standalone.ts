import spawn from 'cross-spawn';
import gulp from 'gulp';
import through2 from 'through2';
import { join } from 'upath';
import { getConfig } from './gulp.config';
import { replacePath } from './utils/string';

/**
 * run all _*.standalone.js inside src-posts (_config_yml.post_dir)
 * @returns
 */
function standaloneRunner() {
  console.log('[standalone] Running scripts...\n');
  return gulp
    .src(join(getConfig().cwd, '**/_*.standalone.js'), { cwd: getConfig().cwd, ignore: ['**/tmp/**'] })
    .pipe(
      through2.obj(async function (file, _enc, next) {
        console.log('='.repeat(10) + ' input ' + '='.repeat(10));
        console.log(`node ${await replacePath(file.path, getConfig().cwd, '')}`);
        console.log('='.repeat(10) + ' ouput ' + '='.repeat(10));
        const child = spawn('node', [file.path], { stdio: 'inherit' });
        child.on('close', () => {
          // drop file
          next();
        });
      })
    )
    .pipe(gulp.dest(join(getConfig().cwd, 'tmp/standalone')))
    .once('end', function () {
      console.log('\n[standalone] stopped');
    });
}

gulp.task('post:standalone', standaloneRunner);

export default standaloneRunner;
