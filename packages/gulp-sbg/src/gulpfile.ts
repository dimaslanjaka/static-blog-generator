import gulp from 'gulp';
import { spawn } from 'hexo-util';
import { TaskCallback } from 'undertaker';
import { join } from 'upath';
import './gulp.clean';
import { deployConfig } from './gulp.deploy';
import './gulp.feed';
import './gulp.post';
import './gulp.safelink';

// commit current project
export function commitProject(finish: TaskCallback) {
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
        if (e instanceof Error) console.log(e.message, gitDir);
      })
      .finally(() => {
        gitDirs.shift();
        commit();
      });
  };
  return commit();
}

gulp.task('project-commit', commitProject);

const copyGen = () => {
  const { deployDir } = deployConfig();
  return gulp
    .src(['**/**', '!**/.git*', '!**/tmp/**', '!**/node_modules/**'], {
      cwd: join(process.cwd(), 'public'),
      dot: true
    })
    .pipe(gulp.dest(deployDir))
    .on('error', console.trace);
};

// copy public to .deploy_git
gulp.task('copy', copyGen);

// deploy
gulp.task('deploy', gulp.series('pull', 'copy', 'safelink', 'commit', 'push'));
