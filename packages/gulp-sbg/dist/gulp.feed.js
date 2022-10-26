"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const gulp_1 = __importDefault(require("gulp"));
const gulp_dom_1 = __importDefault(require("gulp-dom"));
const hexo_1 = __importDefault(require("hexo"));
const hexo_util_1 = require("hexo-util");
const nunjucks_1 = __importDefault(require("nunjucks"));
const upath_1 = require("upath");
const gulp_config_1 = __importDefault(require("./gulp.config"));
const env = new nunjucks_1.default.Environment();
env.addFilter('uriencode', (str) => {
    return (0, hexo_util_1.encodeURL)(str);
});
env.addFilter('noControlChars', (str) => {
    return str.replace(/[\x00-\x1F\x7F]/g, ''); // eslint-disable-line no-control-regex
});
gulp_1.default.task('feed', function (done) {
    const instance = new hexo_1.default(process.cwd());
    instance.init().then(() => {
        instance.load().then(() => {
            env.addFilter('formatUrl', (str) => {
                return hexo_util_1.full_url_for.call(instance, str);
            });
            const config = gulp_config_1.default;
            function build(tmplSrc, dest) {
                const template = nunjucks_1.default.compile((0, fs_1.readFileSync)(tmplSrc, 'utf8'), env);
                let posts = instance.locals.get('posts');
                posts = posts.sort('-date');
                posts = posts.filter((post) => {
                    return post.draft !== true;
                });
                const { email, feed, url: urlCfg } = config;
                const { icon: iconCfg } = feed;
                let url = urlCfg;
                if (url[url.length - 1] !== '/')
                    url += '/';
                let icon = '';
                if (iconCfg)
                    icon = hexo_util_1.full_url_for.call(instance, iconCfg);
                else if (email)
                    icon = (0, hexo_util_1.gravatar)(email, {});
                const feed_url = hexo_util_1.full_url_for.call(instance, 'rss.xml');
                const data = template.render({
                    config,
                    url,
                    icon,
                    posts,
                    feed_url
                });
                (0, fs_1.writeFileSync)(dest, data);
            }
            const templateRSS = (0, upath_1.join)(__dirname, '_config_template_rss.xml');
            const destRSS = (0, upath_1.join)(process.cwd(), 'public/rss.xml');
            build(templateRSS, destRSS);
            const templateATOM = (0, upath_1.join)(__dirname, '_config_template_atom.xml');
            const destATOM = (0, upath_1.join)(process.cwd(), 'public/atom.xml');
            build(templateATOM, destATOM);
            const baseURL = config.url.endsWith('/') ? config.url : config.url + '/';
            const publicDir = (0, upath_1.join)(process.cwd(), 'public');
            gulp_1.default
                .src('**/*.html', { cwd: publicDir })
                .pipe((0, gulp_dom_1.default)(function () {
                if (!this.getElementById('rss-site-url')) {
                    this.head.innerHTML += `<link id="rss-site-url" type="application/rss+xml" rel="alternate" href="${baseURL}rss.xml" /><link id="atom-site-url" type="application/rss+xml" rel="alternate" href="${baseURL}atom.xml" />`;
                }
                this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
            }))
                .pipe(gulp_1.default.dest(publicDir))
                .once('end', () => done());
        });
    });
});
