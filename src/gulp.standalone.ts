import spawn from 'cross-spawn';
import gulp from 'gulp';
import through2 from 'through2';
import { join } from 'upath';
import ProjectConfig from './gulp.config';
import { replacePath } from './utils/string';

function standaloneRunner() {
  gulp.src(join(ProjectConfig.cwd, '**/_*.standalone.js')).pipe(
    through2.obj(function (file, _enc, next) {
      console.log(`node ${replacePath(file.path, ProjectConfig.cwd, '')}`);
      const child = spawn('node', [file.path], { stdio: 'inherit' });
      child.on('close', () => {
        // drop file
        next();
      });
    })
  );
}

export default standaloneRunner;
