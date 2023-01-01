"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyAllPosts = exports.updatePost = exports.copySinglePost = exports.watchPost = void 0;
var tslib_1 = require("tslib");
var front_matter_1 = tslib_1.__importDefault(require("front-matter"));
var fs_1 = require("fs");
var gulp_1 = tslib_1.__importDefault(require("gulp"));
var hexo_post_parser_1 = require("hexo-post-parser");
var moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
var through2_1 = tslib_1.__importDefault(require("through2"));
var upath_1 = require("upath");
var gulp_cache_1 = require("./gulp-utils/gulp.cache");
var gulp_config_1 = require("./gulp.config");
var fm_1 = require("./utils/fm");
var logger_1 = tslib_1.__importDefault(require("./utils/logger"));
var scheduler_1 = tslib_1.__importDefault(require("./utils/scheduler"));
var sourceDir = (0, upath_1.join)(process.cwd(), 'src-posts');
var destDir = (0, upath_1.join)(process.cwd(), 'source/_posts');
function watchPost(done) {
    var watcher = gulp_1.default.watch(['**/*'], { cwd: sourceDir });
    watcher.on('change', function (path) {
        (0, exports.copySinglePost)(path);
    });
    watcher.on('add', function (path) {
        (0, exports.copySinglePost)(path);
    });
    watcher.once('close', done);
}
exports.watchPost = watchPost;
var copySinglePost = function (identifier, callback) {
    identifier = identifier.replace((0, upath_1.extname)(identifier), '');
    gulp_1.default
        .src(['**/*' + identifier + '*/*', '**/*' + identifier + '*'], {
        cwd: sourceDir
    })
        .pipe(updatePost())
        .pipe(gulp_1.default.dest(destDir))
        .on('end', function () {
        if (typeof callback === 'function')
            callback();
    });
};
exports.copySinglePost = copySinglePost;
function updatePost() {
    return through2_1.default.obj(function (file, _enc, next) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var config, parse, oriUp_1, oriPath_1, post_1, rBuild_1, build;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (file.isNull())
                            return [2, next()];
                        if (!(file.extname === '.md')) return [3, 2];
                        config = (0, gulp_config_1.getConfig)();
                        return [4, (0, hexo_post_parser_1.parsePost)(file.path, {
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
                                config: config,
                                formatDate: true,
                                fix: true,
                                sourceFile: file.path
                            })];
                    case 1:
                        parse = _a.sent();
                        if (parse && parse.metadata) {
                            oriUp_1 = parse.metadata.updated;
                            oriPath_1 = file.path;
                            parse.metadata.updated = (0, moment_timezone_1.default)()
                                .tz(config.timezone || 'UTC')
                                .format();
                            post_1 = (0, front_matter_1.default)(String(file.contents));
                            if ('updated' in post_1.attributes === false) {
                                post_1.attributes.updated = parse.metadata.updated;
                            }
                            post_1.attributes.updated = parse.metadata.updated;
                            post_1.attributes.date = parse.metadata.date;
                            if ('modified' in parse.metadata) {
                                post_1.attributes.modified = parse.metadata.modified;
                            }
                            rBuild_1 = {
                                metadata: post_1.attributes,
                                body: post_1.body,
                                content: post_1.body,
                                config: config
                            };
                            scheduler_1.default.add(oriPath_1, function () {
                                var rebuild = (0, hexo_post_parser_1.buildPost)(rBuild_1);
                                logger_1.default.log('write to', (0, upath_1.toUnix)(oriPath_1).replace((0, upath_1.toUnix)(process.cwd()), ''), oriUp_1, '->', post_1.attributes.updated);
                                (0, fs_1.writeFileSync)(oriPath_1, rebuild);
                            });
                            build = (0, hexo_post_parser_1.buildPost)(parse);
                            file.contents = Buffer.from(build);
                            return [2, next(null, file)];
                        }
                        else {
                            logger_1.default.log('cannot parse', file.path);
                            return [2, next(null)];
                        }
                        _a.label = 2;
                    case 2:
                        next(null, file);
                        return [2];
                }
            });
        });
    });
}
exports.updatePost = updatePost;
function copyAllPosts() {
    var _this = this;
    var lockfolder = (0, upath_1.join)(process.cwd(), 'tmp/static-blog-generator/', arguments.callee.name);
    var lockfile = (0, upath_1.join)(lockfolder, 'index.lock');
    if ((0, fs_1.existsSync)(lockfile)) {
        console.log('another process still running');
        var writeStream = (0, fs_1.createWriteStream)((0, upath_1.join)(lockfolder, 'pid-' + process.pid), { flags: 'a' });
        writeStream.write(new Date());
        writeStream.close();
        return writeStream;
    }
    if (!(0, fs_1.existsSync)(lockfile))
        (0, fm_1.writefile)(lockfile, '');
    var config = (0, gulp_config_1.getConfig)();
    var excludes = Array.isArray(config.exclude) ? config.exclude : [];
    excludes.push.apply(excludes, tslib_1.__spreadArray([], tslib_1.__read(gulp_config_1.commonIgnore), false));
    logger_1.default.log('[copy] cwd', (0, upath_1.toUnix)(process.cwd()));
    logger_1.default.log('[copy] copying source posts from', sourceDir.replace((0, upath_1.toUnix)(process.cwd()), ''));
    return (gulp_1.default
        .src(['**/*', '**/*.*', '*.*'], { cwd: sourceDir, ignore: excludes })
        .pipe((0, gulp_cache_1.gulpCached)({ name: 'post' }))
        .pipe(through2_1.default.obj(function (file, _enc, callback) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var config_1, contents, parse, build;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (file.isNull())
                        return [2, callback()];
                    if (!(file.extname === '.md')) return [3, 2];
                    config_1 = (0, gulp_config_1.getConfig)();
                    contents = ((_a = file.contents) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                    if (contents.trim().length === 0)
                        return [2, callback()];
                    return [4, (0, hexo_post_parser_1.parsePost)(contents, {
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
                            config: config_1,
                            formatDate: true,
                            fix: true,
                            sourceFile: file.path
                        })];
                case 1:
                    parse = _b.sent();
                    if (parse && parse.metadata) {
                        build = (0, hexo_post_parser_1.buildPost)(parse);
                        file.contents = Buffer.from(build);
                        return [2, callback(null, file)];
                    }
                    else {
                        logger_1.default.log('cannot parse', (0, upath_1.toUnix)(file.path).replace((0, upath_1.toUnix)(process.cwd()), ''));
                    }
                    _b.label = 2;
                case 2:
                    callback(null, file);
                    return [2];
            }
        });
    }); }))
        .pipe(gulp_1.default.dest(destDir))
        .once('end', function () {
        (0, fs_1.rmSync)(lockfile);
    }));
}
exports.copyAllPosts = copyAllPosts;
gulp_1.default.task('post:copy', copyAllPosts);
gulp_1.default.task('copy-all-post', gulp_1.default.series('post:copy'));
gulp_1.default.task('copy-all-posts', gulp_1.default.series('post:copy'));
gulp_1.default.task('copy-posts', gulp_1.default.series('post:copy'));
gulp_1.default.task('copy-post', gulp_1.default.series('post:copy'));
gulp_1.default.task('watch-post', watchPost);
gulp_1.default.task('watch-posts', watchPost);
