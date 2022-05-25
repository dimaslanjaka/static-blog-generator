import { copyFileSync, existsSync, mkdirSync, statSync } from 'fs';
import gulp from 'gulp';
import { dirname, join } from 'upath';
import color from '../../node/color';
import { globSrc } from '../../node/filemanager';
import { replaceArr } from '../../node/string-utils';
import config, { cwd, root } from '../../types/_config';
const global_exclude = ['**/_drafts/**', '**/_data/**'];
const logname = color.hex('#fcba03')('[render assets]');

/**
 * copy and process assets from {@link config.source_dir} to {@link config.public_dir}
 */
const renderAssets = async () => {
  const srcFolder = join(root, config.source_dir);
  const destFolder = join(root, config.public_dir);
  console.log(
    logname + color.magentaBright('[assets]'),
    'copy',
    srcFolder,
    '->',
    destFolder
  );
  const exclude = config.exclude.map((ePattern) => ePattern.replace(/^!+/, ''));
  const ignore = ['**/*.md', '**/.git*', ...exclude, ...global_exclude];
  const glob = await globSrc('**/*.*', {
    cwd: srcFolder,
    ignore: ignore,
    dot: true,
    stat: true
  }).then((s) => {
    if (config.verbose) {
      console.log(logname + '[total]', s.length);
      console.log(ignore);
    }
    return s;
  });
  for (let i = 0; i < glob.length; i++) {
    const file = glob[i];
    const src = join(srcFolder, file);
    const stat = statSync(src);
    const dest = join(destFolder, file).replace('_posts/', '/');
    //console.log([src, existsSync(src)], '->', dest);
    if (!existsSync(dirname(dest)))
      mkdirSync(dirname(dest), { recursive: true });
    if (!stat.isDirectory() && existsSync(src)) {
      copyFileSync(src, dest);
      console.log(
        logname + color.greenBright(`[${i}]`),
        replaceArr(src, [cwd(), /^\//], ''),
        '->',
        replaceArr(dest, [cwd(), /^\//], '')
      );
    }
  }
};

gulp.task('generate:assets', renderAssets);
