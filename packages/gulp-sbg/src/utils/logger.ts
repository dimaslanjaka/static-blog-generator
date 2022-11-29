import { appendFileSync, existsSync, mkdirpSync, writeFileSync } from 'fs-extra';
import slugify from 'slugify';
import { basename, dirname, join } from 'upath';

const FOLDER = join(process.cwd(), 'tmp/logs/gulp-sbg');
/**
 * @example
 * const console = Logger
 * console.log('hello world'); // should be written in ./tmp/logs/gulp-sbg/[trace-name].log
 */
class Logger {
  static log(...args: any[]) {
    console.log(...args);
    this.tracer(...args);
  }
  private static tracer(...args: any[]) {
    const error = new Error();
    const split = error.stack?.split(/\r?\n/gm).map((str) => {
      const split2 = str.trim().split(' ');
      return {
        name: split2[1],
        path: split2[2]?.replace(/\\+/gm, '/').replace(/^\(/, '').replace(/\)$/, '')
        //trace: error.stack
      };
    });

    if (split) {
      split.splice(0, 3);

      let logfile: string;
      let templ: string;

      // anonymous caller
      if (typeof split[0].path === 'undefined' && split[1].path.includes('anonymous')) {
        const id = split[1].name;
        const path = split[0].name;
        const base = basename(
          path.split(':')[0].length === 1 ? path.split(':')[0] + ':' + path.split(':')[1] : path.split(':')[0]
        );

        logfile = join(FOLDER, slugify(id, { trim: true }) + '-' + slugify(base, { trim: true }) + '.log');
        if (!existsSync(logfile)) {
          mkdirpSync(dirname(logfile));
          writeFileSync(logfile, '');
        }
        templ = `${'='.repeat(20)}\nfile: ${path}\ndate: ${new Date()}\n${'='.repeat(20)}\n\n`;
        args.forEach((o) => {
          if (o === null) o = 'null';
          if (typeof o === 'object') {
            try {
              o = JSON.stringify(o, null, 2);
            } catch {
              //
            }
          }
          templ += String(o) + '\n\n';
        });
        appendFileSync(logfile, templ);
      }
      // console.log(split);
    }
  }
}

export default Logger;
