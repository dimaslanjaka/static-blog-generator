import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import { getConfig, normalizePathUnix } from 'sbg-utility';
import { gulpCopyAsync } from '../utils/gulp-utils';

export interface deployCopyOptions {
  cwd: string;
  config: ReturnType<typeof getConfig>;
}

/**
 * Copy generated site to deployment directory.
 * @param opt - Optional configuration for deploying.
 * @param ignore - Files or directories to exclude from the copy.
 */
export async function deployCopy(opt?: deployCopyOptions) {
  const defaultConf = getConfig();
  const config = Object.assign(defaultConf, opt?.config || {});
  const public_dir = normalizePathUnix(config.cwd, config.public_dir);
  const deploy_dir = normalizePathUnix(config.deploy.deployDir);

  // Log with color for variables inside `${}`
  console.log(`Copying folder ${ansiColors.cyan(public_dir)} -> ${ansiColors.cyan(deploy_dir)}`);
  await fs.copy(public_dir, deploy_dir, { overwrite: true, errorOnExist: false });

  const ignore = ['**/.git/**', '**/.gitignore', '**/node_modules/**', '**/tmp/**'].concat(...config.exclude);
  console.log(
    `Copying all files ${ansiColors.cyan(public_dir)} -> ${ansiColors.cyan(deploy_dir)} except ${ansiColors.yellow(ignore.join(', '))}`
  );
  await gulpCopyAsync(['**/*.*', '**/.*.*', '**/*'], deploy_dir, {
    ignore,
    cwd: public_dir
  });

  // Copy source post assets into deployment directory
  const sourcePostDir = normalizePathUnix(config.cwd, config.post_dir);
  console.log(`Copying images ${ansiColors.cyan(sourcePostDir)} -> ${ansiColors.cyan(deploy_dir)}`);
  await gulpCopyAsync(['**/*.{jpg,png,jpeg,bmp,svg,webp,gif,ico,tiff,tif,heif,heic,raw,apng,jfif}'], deploy_dir, {
    ignore,
    cwd: sourcePostDir,
    encoding: false
  });

  // Copy generated post assets into deployment directory
  const generatedPostDir = normalizePathUnix(config.cwd, config.source_dir, '_posts');
  console.log(`Copying images ${ansiColors.cyan(generatedPostDir)} -> ${ansiColors.cyan(deploy_dir)}`);
  await gulpCopyAsync(['**/*.{jpg,png,jpeg,bmp,svg,webp,gif,ico,tiff,tif,heif,heic,raw,apng,jfif}'], deploy_dir, {
    ignore,
    cwd: generatedPostDir,
    encoding: false
  });
}
