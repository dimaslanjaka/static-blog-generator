import spawn from 'cross-spawn';
import gulp from 'gulp';
import through2 from 'through2';
import { join } from 'upath';
import ProjectConfig from './gulp.config';
import { replacePath } from './utils/string';

function standaloneRunner() {
  console.log('[standalone] Running scripts...');
  gulp.src(join(ProjectConfig.cwd, '**/_*.standalone.js')).pipe(
    through2
      .obj(async function (file, _enc, next) {
        console.log('='.repeat(10) + ' input ' + '='.repeat(10));
        console.log(`node ${await replacePath(file.path, ProjectConfig.cwd, '')}`);
        console.log('='.repeat(10) + ' ouput ' + '='.repeat(10));
        const child = spawn('node', [file.path], { stdio: 'inherit' });
        child.on('close', () => {
          // drop file
          next();
        });
      })
      .pipe(gulp.dest(join(ProjectConfig.cwd, 'tmp/standalone')))
      .once('end', function () {
        console.log('[standalone] stopped');
      })
  );
}

export default standaloneRunner;
