import { appendFileSync, existsSync } from 'fs-extra';
import { EOL } from 'os';
import slugify from 'slugify';
import { basename, join, toUnix } from 'upath';
import * as configs from '../config';
import { writefile } from './filemanager';
import { areWeTestingWithJest } from './jest';

const getConfig = configs.getConfig;
const FOLDER = join(process.cwd(), 'tmp/logs');

declare global {
  const hexo: import('hexo');
}

// disable console.log on jest
if (areWeTestingWithJest()) {
  // const log = console.log;
  console.log = function (...args: any[]) {
    const config = getConfig();
    const stack = new Error('').stack?.split(/\r?\n/gm);
    let msg = (stack || [])[3] || '';
    if (msg.includes(__filename)) {
      msg = (stack || [])[4] || '';
    }
    const filename = slugify(toUnix(msg).replace(toUnix(config.cwd), ''), {
      lower: true,
      trim: true,
      replacement: '-',
      strict: true
    });
    writefile(join(config.cwd, 'tmp/logs/', filename + '.log'), args.join(EOL), { append: true });
  };
}

const _log = typeof hexo === 'undefined' ? console : Object.assign({ log: console.log }, hexo.log);

/**
 * @example
 * const console = Logger
 * Logger.log('hello world'); // should be written in <temp folder>/logs/[trace-name].log
 */
export class Logger {
  static log(...args: any[]) {
    _log.log(...args);
    this.tracer(...args);
  }

  static info(...args: any[]) {
    _log.info.apply(null, args);
    this.tracer(...args);
  }

  static error(...args: any[]) {
    _log.error.apply(null, args);
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
          writefile(logfile, '');
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
      // Logger.log(split);
    }
  }
}

export default Logger;
