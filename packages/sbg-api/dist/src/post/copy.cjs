'use strict';

var ansiColors = require('ansi-colors');
var fs = require('fs-extra');
var glob = require('glob');
var gulp = require('gulp');
var hexoPostParser = require('hexo-post-parser');
var moment = require('moment-timezone');
var sbgUtils = require('sbg-utility');
var path = require('upath');
var path$1 = require('../utils/path.cjs');
var copyUtils = require('./copy-utils.cjs');
var permalink = require('./permalink.cjs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var hexoPostParser__namespace = /*#__PURE__*/_interopNamespaceDefault(hexoPostParser);

/**
 * log debug
 *
 * @example
 * cross-env-shell DEBUG=* "your commands"
 */
const log = sbgUtils.debug('post');
const logErr = log.extend('error');
const logLabel = log.extend('label');
/**
 * Copy single post from src-posts folder to source/_posts
 * @param identifier
 * @param callback
 */
function copySinglePost(identifier, callback) {
    identifier = identifier.replace(path.extname(identifier), '');
    const config = sbgUtils.getConfig();
    const sourcePostDir = path.join(config.cwd, config.post_dir);
    const generatedPostDir = path.join(config.cwd, config.source_dir, '_posts');
    ///const fileList = [];
    gulp
        .src(['**/*' + identifier + '*/*', '**/*' + identifier + '*'], {
        cwd: sourcePostDir
    })
        .pipe(gulp.dest(generatedPostDir))
        .on('end', function () {
        //Logger.log(fileList);
        if (typeof callback === 'function')
            callback();
    });
}
// /**
//  * copy all posts from src-posts to source/_posts
//  * @returns
//  */
// function _copyAllPosts(_callback?: gulp.TaskFunctionCallback, config?: ReturnType<typeof getConfig>) {
//   if (!config) config = getConfig();
//   const excludes = config.exclude || [];
//   const sourcePostDir = path.join(config.cwd, config.post_dir);
//   const generatedPostDir = path.join(config.cwd, config.source_dir, '_posts');
//   // console.log(excludes, sourcePostDir);
//   return (
//     gulp
//       .src(['**/*.*', '*.*', '**/*'], {
//         cwd: sourcePostDir,
//         ignore: excludes,
//         dot: true,
//         noext: true
//       } as gulpOpt)
//       //.pipe(gulpLog('before'))
//       .pipe(gulpCached({ name: 'post-copy' }))
//       .pipe(pipeProcessPost(config))
//       .pipe(gulp.dest(generatedPostDir))
//   );
// }
/**
 * copy all posts from src-posts to source/_posts
 * @returns
 */
function copyAllPosts(config) {
    if (!config)
        config = sbgUtils.getConfig();
    const excludes = config.exclude || [];
    const sourcePostDir = path.join(config.cwd, config.post_dir);
    const generatedPostDir = path.join(config.cwd, config.source_dir, '_posts');
    const posts = glob.globSync(['**/*.*', '*.*', '**/*'], {
        cwd: sourcePostDir,
        ignore: excludes,
        dot: true,
        noext: true,
        absolute: true
    }).map((s) => sbgUtils.normalizePath(s));
    return copyUtils.processFiles(posts, async function (filePath, content) {
        const compile = await processSinglePost({ content, file: filePath }).catch(() => null);
        if (typeof compile === 'string') {
            const fileWithoutCwd = path$1.removeCwd(filePath).replace(/[/\\]src-posts[/\\]/, '');
            const dest = path.join(generatedPostDir, fileWithoutCwd);
            fs.ensureDirSync(path.dirname(dest));
            fs.writeFileSync(dest, compile);
        }
    }, sbgUtils.noop);
}
// /**
//  * pipeable function to process post
//  * @param config
//  * @returns
//  */
// export function pipeProcessPost(config: ReturnType<typeof getConfig>) {
//   const logname = 'post:' + ansiColors.blueBright('processing');
//   if (config.generator.verbose) {
//     Logger.log(logname, 'cache=' + (config.generator.cache ? ansiColors.green('true') : ansiColors.red('false')));
//   }
//   return through2.obj(
//     async function (file, _enc, callback) {
//       if (file.isDirectory()) {
//         return callback();
//       }
//       if (file.isNull()) {
//         logErr(file.path + ' is null');
//         return callback();
//       }
//       if (file.isStream()) {
//         logErr(file.path + ' is stream');
//         return callback();
//       }
//       if (config) {
//         // process markdown files
//         if (file.extname === '.md') {
//           // log('copying ' + file.path.replace(process.cwd(), ''));
//           const compile = await processSinglePost(file.path);
//           if (typeof compile === 'string') {
//             file.contents = Buffer.from(compile);
//             this.push(file);
//             forceGc();
//             callback();
//           } else {
//             callback();
//           }
//         } else {
//           this.push(file);
//           forceGc();
//           callback();
//         }
//       } else {
//         Logger.log('options not configured');
//         callback();
//       }
//     }
//     /*function (cb) {
//       this.emit('end', 2);
//       cb();
//     }*/
//   );
// }
/**
 * process single markdown post
 * @param file file path or contents
 * @param callback
 * @returns
 */
async function processSinglePost(options, callback) {
    const { content, file } = options;
    const contents = content || fs.readFileSync(file, 'utf-8');
    const config = sbgUtils.getConfig();
    // debug file
    const dfile = ansiColors.yellowBright(sbgUtils.normalizePath(options.file.replace(config.cwd, '')));
    log('processing', dfile);
    // drop empty body
    if (contents.trim().length === 0) {
        logErr('content empty', dfile);
        return;
    }
    try {
        const parse = await hexoPostParser__namespace
            .parsePost(contents, {
            shortcodes: {
                youtube: true,
                css: true,
                include: true,
                link: true,
                now: true,
                script: true,
                text: true,
                codeblock: true
            },
            cache: false,
            //config: <any>getConfig(),
            formatDate: true,
            fix: true,
            sourceFile: file
        })
            .catch((e) => sbgUtils.Logger.log(e));
        if (parse && parse.metadata) {
            if (parse.metadata.date) {
                // skip scheduled post
                const createdDate = moment(String(parse.metadata.date));
                const today = moment(new Date());
                const diff = today.diff(createdDate);
                // log('today=' + today.format(), 'created=' + createdDate.format(), 'isGreater=' + String(diff));
                // if creation date greater than now
                // if (moment(new Date()).isAfter(createdDate)) {
                if (diff < 0) {
                    log('skip scheduled post ' + dfile);
                    // otherwise return null
                    return;
                }
            }
            // fix permalink
            log.extend('permalink').extend('pattern')(config.permalink);
            //parse.metadata.permalink = hexoPostParser.parsePermalink(parse);
            if (!parse.metadata.permalink) {
                parse.metadata.permalink = permalink.parsePermalink(file, {
                    title: parse.metadata.title,
                    date: String(parse.metadata.date || new Date()),
                    permalink_pattern: sbgUtils.getConfig().permalink
                });
            }
            if (parse.metadata.permalink?.startsWith('/')) {
                parse.metadata.permalink = parse.metadata.permalink.replace(/^\//, '');
            }
            log.extend('permalink')(parse.metadata.permalink);
            // fix uuid and id
            if (parse.metadata.uuid) {
                if (!parse.metadata.id)
                    parse.metadata.id = parse.metadata.uuid;
                delete parse.metadata.uuid;
            }
            // process tags and categories
            const array = ['tags', 'categories'];
            for (let i = 0; i < array.length; i++) {
                const groupLabel = array[i];
                if (parse.metadata[groupLabel]) {
                    // label assign
                    if (config[groupLabel]?.assign) {
                        for (const oldLabel in config[groupLabel].assign) {
                            const index = parse.metadata[groupLabel].findIndex((str) => str == oldLabel);
                            if (index !== -1) {
                                logLabel(groupLabel, parse.metadata[groupLabel], ansiColors.yellowBright('+'), config[groupLabel].assign[oldLabel]);
                                parse.metadata[groupLabel] = parse.metadata[groupLabel].concat(config[groupLabel].assign[oldLabel]);
                                logLabel.extend('result')(groupLabel, parse.metadata[groupLabel]);
                            }
                        }
                    }
                    // label mapper
                    if (config[groupLabel]?.mapper) {
                        for (const oldLabel in config[groupLabel].mapper) {
                            const index = parse.metadata[groupLabel].findIndex((str) => str === oldLabel);
                            if (index !== -1) {
                                parse.metadata[groupLabel][index] = config[groupLabel].mapper[oldLabel];
                                if (config.generator.verbose) {
                                    sbgUtils.Logger.log(ansiColors.redBright(parse.metadata[groupLabel][index]), '~>', ansiColors.greenBright(config[groupLabel].mapper[oldLabel]));
                                }
                            }
                        }
                    }
                    // label lowercase
                    if (config.tags?.lowercase) {
                        parse.metadata[groupLabel] =
                            parse.metadata[groupLabel]?.map((str) => {
                                if (typeof str === 'string')
                                    return str.toLowerCase();
                                if (Array.isArray(str)) {
                                    return str.map((s) => {
                                        if (typeof s === 'string')
                                            return s.toLowerCase();
                                        return s;
                                    });
                                }
                                return str;
                            }) || [];
                        log.extend('label').extend('lowercase')(groupLabel, parse.metadata[groupLabel]);
                    }
                }
                else if (config.generator.verbose) {
                    sbgUtils.Logger.log(groupLabel, 'not found');
                }
                // Logger.log(groupLabel + '-' + ansiColors.greenBright('assign'), parse.metadata[groupLabel]);
            }
            if (typeof callback === 'function') {
                callback(parse);
            }
            const build = hexoPostParser__namespace.buildPost(parse);
            if (typeof build === 'string') {
                return build;
            }
        }
        else {
            logErr(String(parse), file);
        }
    }
    catch (e) {
        sbgUtils.Logger.log(e);
    }
}

exports.copyAllPosts = copyAllPosts;
exports.copySinglePost = copySinglePost;
exports.processSinglePost = processSinglePost;
