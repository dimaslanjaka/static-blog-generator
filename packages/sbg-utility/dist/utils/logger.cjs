'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs-extra');
var slugify = require('slugify');
var path = require('upath');
var _config = require('../config/_config.cjs');
require('../config/config-wrapper.cjs');
require('../config/default-config.cjs');
require('path');
require('bluebird');
require('minimatch');
require('./filemanager/case-path.cjs');
var writefile = require('./filemanager/writefile.cjs');
var jest = require('./jest.cjs');

let FOLDER = path.join(process.cwd(), 'tmp/logs');
let cwd = process.cwd();
/*
declare global {
  const hexo: import('hexo');
}
*/
// disable console.log on jest
if (jest.areWeTestingWithJest()) {
    const log = console.log;
    console.log = function (...args) {
        if (typeof _config.getConfig === 'function') {
            const cfg = _config.getConfig();
            FOLDER = path.join(cfg.cwd, 'tmp/logs/');
            cwd = cfg.cwd;
        }
        const stack = (new Error('').stack || '').split(/\r?\n/gm);
        let msg = (stack || [])[3] || '';
        if (msg.includes(__filename)) {
            msg = (stack || [])[2] || '';
        }
        // log(stack[2], stack[4]);
        const filename = slugify(path.toUnix(msg).replace(path.toUnix(cwd), ''), {
            lower: true,
            trim: true,
            replacement: '-',
            strict: true
        });
        const header = `\n\n ${new Date()} \n\n`;
        const write = writefile.writefile(path.join(FOLDER, filename + '.log'), header + args.join('\n\n'), { append: true });
        log(write.file);
    };
}
//const _log = typeof hexo === 'undefined' ? console : Object.assign({ log: console.log }, hexo.log);
const _log = console;
/**
 * @example
 * const console = Logger
 * Logger.log('hello world'); // should be written in <temp folder>/logs/[trace-name].log
 */
class Logger {
    static log(...args) {
        _log.log(...args);
        this.tracer(...args);
    }
    static info(...args) {
        _log.info.apply(null, args);
        this.tracer(...args);
    }
    static error(...args) {
        _log.error.apply(null, args);
        this.tracer(...args);
    }
    static tracer(...args) {
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
            let logfile;
            let templ;
            // anonymous caller
            if (typeof split[0].path === 'undefined' && split[1].path.includes('anonymous')) {
                const id = split[1].name;
                const filePath = split[0].name;
                const base = path.basename(filePath.split(':')[0].length === 1
                    ? filePath.split(':')[0] + ':' + filePath.split(':')[1]
                    : filePath.split(':')[0]);
                logfile = path.join(FOLDER, slugify(id, { trim: true }) + '-' + slugify(base, { trim: true }) + '.log');
                if (!fs.existsSync(logfile)) {
                    writefile.writefile(logfile, '');
                }
                templ = `${'='.repeat(20)}\nfile: ${filePath}\ndate: ${new Date()}\n${'='.repeat(20)}\n\n`;
                args.forEach((o) => {
                    if (o === null)
                        o = 'null';
                    if (typeof o === 'object') {
                        try {
                            o = JSON.stringify(o, null, 2);
                        }
                        catch {
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

exports.Logger = Logger;
exports.default = Logger;
