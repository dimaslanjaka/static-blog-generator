import { minimatch } from 'minimatch';
import readDir from './readDir';

interface emptyDirOpt {
  ignore: (string | RegExp)[];
}

/**
 * empty dir with filters
 * @param dir
 * @param param1
 */
export function emptyDir(dir: string, { ignore }: emptyDirOpt) {
  readDir(dir, function (err, fileList) {
    if (err) throw err;
    // const filterFn = (pattern: string) => minimatch.filter(pattern, { matchBase: true });
    const filter = fileList.filter((file) => {
      for (let i = 0; i < ignore.length; i++) {
        const pattern = ignore[i];
        if (typeof pattern === 'string') {
          const match = minimatch(file, pattern, { matchBase: true, dot: true });
          // console.log(file.replace(dir, ''), pattern, match);
          // filter file if matched
          if (match) return false;
        } else {
          // filter file if matched
          if (pattern.test(file)) return false;
        }
      }
      return true;
    });
    return filter;
  });
}

//const _ex = path.join(__dirname, '../..');
//emptyDir(_ex, { ignore: ['**/config/**'] });
