import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'fs';
import { basename, dirname, join, normalize, toUnix } from 'upath';
import { isValidHttpUrl } from './gulp/utils';
import color from './node/color';
import sanitizeFilename from './node/sanitize-filename';
import { replaceArr } from './node/utils';
import parsePost from './parsePost';
import { post_generated_dir } from './types/_config';
import { removeDoubleSlashes } from './utils/string';

export default function post_assets_fixer(
  target: Parameters<typeof parsePost>[0],
  options: Parameters<typeof parsePost>[1],
  sourcePath: string
) {
  const logname = color['Teal Blue']('[PAF]');
  /**
   * source file if variable `text` is file
   */
  let originalFile = target;
  const isFile = existsSync(target) && statSync(target).isFile();
  if (isFile) {
    target = String(readFileSync(target, 'utf-8'));
    if (options.sourceFile) originalFile = options.sourceFile;
  }
  const publicFile = isFile
    ? toUnix(normalize(originalFile))
    : toUnix(normalize(options.sourceFile));
  if (!publicFile) return sourcePath;
  // replace extended title from source
  sourcePath = sourcePath.replace(/['"](.*)['"]/gim, '').trim();
  // return base64 image
  if (sourcePath.startsWith('data:image')) return sourcePath;
  if (sourcePath.startsWith('//')) sourcePath = 'http:' + sourcePath;
  if (sourcePath.includes('%20')) sourcePath = decodeURIComponent(sourcePath);
  if (!isValidHttpUrl(sourcePath) && !sourcePath.startsWith('/')) {
    let result: string | null = null;
    /** search from same directory */
    const f1 = join(dirname(publicFile), sourcePath);
    /** search from parent directory */
    const f2 = join(dirname(dirname(publicFile)), sourcePath);
    /** search from root directory */
    const f3 = join(process.cwd(), sourcePath);
    const f4 = join(post_generated_dir, sourcePath);
    [f1, f2, f3, f4].forEach((src) => {
      if (result !== null) return;
      if (existsSync(src) && !result) result = src;
    });

    if (result === null) {
      const log = join(
        __dirname,
        '../tmp/errors/post-asset-folder/' +
          sanitizeFilename(basename(sourcePath).trim(), '-') +
          '.log'
      );
      if (!existsSync(dirname(log)))
        mkdirSync(dirname(log), { recursive: true });
      writeFileSync(
        log,
        JSON.stringify({ str: sourcePath, f1, f2, f3, f4 }, null, 2)
      );
      console.log(logname, color.redBright('[fail]'), {
        str: sourcePath,
        log
      });
    } else {
      result = replaceArr(
        result,
        [toUnix(process.cwd()), 'source/', '_posts', 'src-posts'],
        '/'
      );
      result = encodeURI((options.config?.root || '') + result);

      result = removeDoubleSlashes(result);

      if (options.config['verbose']) console.log(logname, '[success]', result);

      return result;
    }
  }
  return sourcePath;
}
