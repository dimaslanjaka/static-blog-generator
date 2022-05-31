import gulp from 'gulp';
import config from '../../../types/_config';
import './firebase';
import { deployFirebase } from './firebase';
import { deployerGit } from './git';

gulp.task('deploy-git', deployerGit);
gulp.task('deploy-firebase', deployFirebase);

if (
  'deploy' in config &&
  typeof config.deploy == 'object' &&
  'type' in config.deploy
) {
  gulp.task('deploy', gulp.series('deploy-' + config['deploy']['type']));
}
