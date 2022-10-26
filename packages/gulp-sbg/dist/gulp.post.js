"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyAllPosts = exports.copyPost = exports.copySinglePost = exports.watchPost = void 0;
const front_matter_1 = __importDefault(require("front-matter"));
const fs_1 = require("fs");
const gulp_1 = __importDefault(require("gulp"));
const hexo_post_parser_1 = require("hexo-post-parser");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const through2_1 = __importDefault(require("through2"));
const upath_1 = require("upath");
const gulp_config_1 = __importDefault(require("./gulp.config"));
const scheduler_1 = __importDefault(require("./utils/scheduler"));
const sourceDir = (0, upath_1.join)(process.cwd(), 'src-posts');
const destDir = (0, upath_1.join)(process.cwd(), 'source/_posts');
function watchPost(done) {
    const watcher = gulp_1.default.watch(['**/*'], { cwd: sourceDir });
    watcher.on('change', (path) => {
        (0, exports.copySinglePost)(path);
    });
    watcher.on('add', (path) => {
        (0, exports.copySinglePost)(path);
    });
    watcher.once('close', done);
}
exports.watchPost = watchPost;
const copySinglePost = (identifier, callback) => {
    identifier = identifier.replace((0, upath_1.extname)(identifier), '');
    ///const fileList = [];
    gulp_1.default
        .src(['**/*' + identifier + '*/*', '**/*' + identifier + '*'], {
        cwd: sourceDir
    })
        .pipe(copyPost())
        .pipe(gulp_1.default.dest(destDir))
        .on('end', function () {
        //console.log(fileList);
        if (typeof callback === 'function')
            callback();
    });
};
exports.copySinglePost = copySinglePost;
function copyPost() {
    return through2_1.default.obj(function (file, _enc, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ///fileList.push(file.path);
            if (file.isNull())
                return next();
            // process markdown files
            if (file.extname === '.md') {
                const config = gulp_config_1.default;
                const parse = yield (0, hexo_post_parser_1.parsePost)(file.path, {
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
                });
                if (parse) {
                    // update post modified
                    const oriUp = parse.metadata.updated;
                    const oriPath = file.path;
                    parse.metadata.updated = (0, moment_timezone_1.default)()
                        .tz(config.timezone || 'UTC')
                        .format();
                    /*parse.metadata.date = moment(String(parse.metadata.date))
                      .tz(config.timezone || 'UTC')
                      .format();*/
                    const post = (0, front_matter_1.default)(String(file.contents));
                    if ('updated' in post.attributes === false) {
                        post.attributes.updated = parse.metadata.updated;
                    }
                    post.attributes.updated = parse.metadata.updated;
                    post.attributes.date = parse.metadata.date;
                    if ('modified' in parse.metadata) {
                        post.attributes.modified = parse.metadata.modified;
                    }
                    const rBuild = {
                        metadata: post.attributes,
                        body: post.body,
                        content: post.body,
                        config: config
                    };
                    // update original source post after process ends
                    scheduler_1.default.add(oriPath, function () {
                        const rebuild = (0, hexo_post_parser_1.buildPost)(rBuild);
                        //writeFileSync(join(process.cwd(), 'tmp/rebuild.md'), rebuild);
                        console.log('write to', (0, upath_1.toUnix)(oriPath).replace((0, upath_1.toUnix)(process.cwd()), ''), oriUp, '->', post.attributes.updated);
                        (0, fs_1.writeFileSync)(oriPath, rebuild); // write original post
                    });
                    const build = (0, hexo_post_parser_1.buildPost)(parse);
                    file.contents = Buffer.from(build);
                    return next(null, file);
                }
                else {
                    console.log('cannot parse', file.path);
                    return next(null);
                }
            }
            // keep copy other files
            next(null, file);
        });
    });
}
exports.copyPost = copyPost;
// copy all posts from src-posts to source/_posts
function copyAllPosts() {
    return gulp_1.default.src('**/*', { cwd: sourceDir }).pipe(copyPost()).pipe(gulp_1.default.dest(destDir));
}
exports.copyAllPosts = copyAllPosts;
gulp_1.default.task('copy-all-post', copyAllPosts);
gulp_1.default.task('watch-post', watchPost);
gulp_1.default.task('watch-posts', watchPost);
