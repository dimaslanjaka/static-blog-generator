import gulp from 'gulp';
import { getConfig } from 'sbg-utility';
import path from 'upath';

export interface deployCopyOptions {
  cwd: string;
  config: ReturnType<typeof getConfig>;
}

/**
 * copy generated site to deployment directory
 * @param opt
 * @param ignore
 */
export function deployCopy(opt: deployCopyOptions, ignore: string | string[] = []) {
  const cwd = opt.cwd || process.cwd();
  return gulp
    .src([path.join(cwd, opt.config.public_dir, '**/*')], { cwd, ignore: ignore || [] })
    .pipe(gulp.dest(path.join(cwd, '.deploy_' + opt.config.deploy.type)));
}
