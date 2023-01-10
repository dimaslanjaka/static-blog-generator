import gulp from 'gulp';
import { spawn } from 'hexo-util';
import { join } from 'upath';
import './clean';
import './gulp.deploy';
import './gulp.feed';
import './gulp.safelink';
import './gulp.seo';
import './post/copy';
import './post/standalone';
import Logger from './utils/logger';

// commit current project
export function commitProject(finish: gulp.TaskFunctionCallback) {
  const gitDirs = [join(process.cwd(), 'src-posts'), join(process.cwd(), 'source'), process.cwd()];
  const commit = () => {
    if (!gitDirs.length) return finish();
    const gitDir = gitDirs[0];
    const opt = {
      cwd: gitDir,
      stdio: 'inherit'
    };
    return spawn('git', ['add', '-A'], <any>opt)
      .then(() => spawn('git', ['commit', '-m', 'update ' + new Date()], <any>opt))
      .catch((e) => {
        if (e instanceof Error) Logger.log(e.message, gitDir);
      })
      .finally(() => {
        gitDirs.shift();
        commit();
      });
  };
  return commit();
}

gulp.task('project-commit', commitProject);

export default gulp;
