"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexoGenerateFeed = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var gulp_dom_1 = __importDefault(require("gulp-dom"));
var hexo_1 = __importDefault(require("hexo"));
var hexo_util_1 = require("hexo-util");
var nunjucks_1 = __importDefault(require("nunjucks"));
var sbg_utility_1 = require("sbg-utility");
var upath_1 = require("upath");
var env = (0, sbg_utility_1.envNunjucks)();
/**
 * generate feed with hexo
 * @param done
 * @param config
 */
function hexoGenerateFeed(done, config) {
    if (config === void 0) { config = (0, sbg_utility_1.getConfig)(); }
    var instance = new hexo_1.default(config.cwd);
    return new bluebird_1.default(function (resolve) {
        instance.init().then(function () {
            instance.load().then(function () {
                env.addFilter('formatUrl', function (str) {
                    return hexo_util_1.full_url_for.call(instance, str);
                });
                function build(tmplSrc, dest) {
                    var template = nunjucks_1.default.compile((0, fs_1.readFileSync)(tmplSrc, 'utf-8'), env);
                    var posts = instance.locals.get('posts');
                    posts = posts.sort('-date');
                    posts = posts.filter(function (post) {
                        return post.draft !== true;
                    });
                    var email = config.email, feed = config.feed, urlCfg = config.url;
                    var iconCfg = feed.icon;
                    var url = urlCfg;
                    if (url[url.length - 1] !== '/')
                        url += '/';
                    // remove broken hexo lang shortcode
                    if (url.includes(':lang/'))
                        url = url.replace('/:lang/', '/');
                    var icon = '';
                    if (iconCfg)
                        icon = hexo_util_1.full_url_for.call(instance, iconCfg);
                    else if (email)
                        icon = (0, hexo_util_1.gravatar)(email, {});
                    var feed_url = hexo_util_1.full_url_for.call(instance, 'rss.xml');
                    var data = template.render({
                        config: config,
                        url: url,
                        icon: icon,
                        posts: posts,
                        feed_url: feed_url
                    });
                    (0, fs_1.writeFileSync)(dest, data);
                }
                var templateRSS = (0, upath_1.join)(__dirname, '_config_template_rss.xml');
                var destRSS = (0, upath_1.join)(config.cwd, config.public_dir, 'rss.xml');
                build(templateRSS, destRSS);
                var templateATOM = (0, upath_1.join)(__dirname, '_config_template_atom.xml');
                var destATOM = (0, upath_1.join)(config.cwd, config.public_dir, 'atom.xml');
                build(templateATOM, destATOM);
                var baseURL = config.url.endsWith('/') ? config.url : config.url + '/';
                var publicDir = (0, upath_1.join)(config.cwd, config.public_dir);
                gulp_1.default
                    .src('**/*.html', { cwd: publicDir, ignore: sbg_utility_1.commonIgnore })
                    .pipe((0, gulp_dom_1.default)(function () {
                    // auto discovery rss
                    if (this.querySelectorAll("link[href=\"".concat(baseURL, "rss.xml\"]")).length === 0 &&
                        this.querySelectorAll("link[href=\"/rss.xml\"]").length === 0) {
                        this.head.innerHTML += "<link id=\"rss-site-url\" type=\"application/rss+xml\" rel=\"alternate\" href=\"".concat(baseURL, "rss.xml\" />");
                    }
                    // auto discovery atom
                    if (this.querySelectorAll("link[href=\"".concat(baseURL, "atom.xml\"]")).length === 0 &&
                        this.querySelectorAll("link[href=\"/atom.xml\"]").length === 0) {
                        this.head.innerHTML += "<link id=\"atom-site-url\" type=\"application/atom+xml\" rel=\"alternate\" href=\"".concat(baseURL, "atom.xml\" />");
                    }
                    //this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
                }))
                    .pipe(gulp_1.default.dest(publicDir))
                    .once('end', function () {
                    if (typeof done === 'function') {
                        done();
                    }
                    resolve(null);
                });
            });
        });
    });
}
exports.hexoGenerateFeed = hexoGenerateFeed;
gulp_1.default.task('feed', hexoGenerateFeed);
//# sourceMappingURL=index.js.map