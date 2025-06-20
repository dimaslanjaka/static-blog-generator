import fs from 'fs-extra';
import path from 'path';
import slugify from 'slugify';
import upath from 'upath';
import { fileURLToPath } from 'url';
import * as configs from '../config';
import { writefile } from './filemanager';
import { areWeTestingWithJest } from './jest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let FOLDER = upath.join(process.cwd(), 'tmp/logs');
let cwd = process.cwd();

/**
 * Disables console.log when running tests with Jest.
 * Logs messages to a file instead.
 */
export function disableConsoleLogForJest(): void {
  if (areWeTestingWithJest()) {
    const log = console.log;
    console.log = function (...args: any[]) {
      if (typeof configs.getConfig === 'function') {
        const cfg = configs.getConfig();
        FOLDER = upath.join(cfg.cwd, 'tmp/logs/');
        cwd = cfg.cwd;
      }
      const stack = (new Error('').stack || '').split(/\r?\n/gm);
      let msg = (stack || [])[3] || '';
      if (msg.includes(__filename)) {
        msg = (stack || [])[2] || '';
      }
      const filename = slugify(upath.toUnix(msg).replace(upath.toUnix(cwd), ''), {
        lower: true,
        trim: true,
        replacement: '-',
        strict: true
      });
      const header = `\n\n ${new Date()} \n\n`;
      const write = writefile(upath.join(FOLDER, filename + '.log'), header + args.join('\n\n'), { append: true });
      log(write.file);
    };
  }
}

//const _log = typeof hexo === 'undefined' ? console : Object.assign({ log: console.log }, hexo.log);
const _log = console;

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
        const filePath = split[0].name;
        const base = upath.basename(
          filePath.split(':')[0].length === 1
            ? filePath.split(':')[0] + ':' + filePath.split(':')[1]
            : filePath.split(':')[0]
        );

        logfile = upath.join(FOLDER, slugify(id, { trim: true }) + '-' + slugify(base, { trim: true }) + '.log');
        if (!fs.existsSync(logfile)) {
          writefile(logfile, '');
        }
        templ = `${'='.repeat(20)}\nfile: ${filePath}\ndate: ${new Date()}\n${'='.repeat(20)}\n\n`;
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
        fs.appendFileSync(logfile, templ);
      }
      // Logger.log(split);
    }
  }
}

export default Logger;
