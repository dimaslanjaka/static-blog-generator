"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUntrackedSitemap = exports.commitProject = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var hexo_util_1 = require("hexo-util");
var sitemap_crawler_1 = require("sitemap-crawler");
var upath_1 = require("upath");
var gulp_deploy_1 = require("./gulp.deploy");
require("./gulp.clean");
require("./gulp.feed");
require("./gulp.post");
require("./gulp.safelink");
// commit current project
function commitProject(finish) {
    var gitDirs = [(0, upath_1.join)(process.cwd(), 'src-posts'), (0, upath_1.join)(process.cwd(), 'source'), process.cwd()];
    var commit = function () {
        if (!gitDirs.length)
            return finish();
        var gitDir = gitDirs[0];
        var opt = {
            cwd: gitDir,
            stdio: 'inherit'
        };
        return (0, hexo_util_1.spawn)('git', ['add', '-A'], opt)
            .then(function () { return (0, hexo_util_1.spawn)('git', ['commit', '-m', 'update ' + new Date()], opt); })
            .catch(function (e) {
            if (e instanceof Error)
                console.log(e.message, gitDir);
        })
            .finally(function () {
            gitDirs.shift();
            commit();
        });
    };
    return commit();
}
exports.commitProject = commitProject;
gulp_1.default.task('project-commit', commitProject);
function getUntrackedSitemap() {
    return new bluebird_1.default(function (resolve) {
        var deployDir = (0, gulp_deploy_1.deployConfig)().deployDir;
        var originfile = (0, upath_1.join)(process.cwd(), 'public/sitemap.txt');
        var outfile = (0, upath_1.join)(deployDir, 'sitemap.txt');
        var sitemaps = (0, fs_1.readFileSync)(originfile, 'utf-8').split(/\r?\n/gm);
        (0, sitemap_crawler_1.sitemapCrawlerAsync)('https://www.webmanajemen.com/chimeraland', {
            deep: 2
        }).then(function (results) {
            sitemaps = Object.values(results)
                .flat(1)
                .concat(sitemaps)
                .filter(function (x, i, a) {
                return a.indexOf(x) === i && typeof x == 'string' && x.length > 0;
            })
                .sort(function (a, b) {
                return a === b ? 0 : a < b ? -1 : 1;
            });
            (0, fs_1.writeFile)(outfile, sitemaps.join('\n'), resolve);
        });
    });
}
exports.getUntrackedSitemap = getUntrackedSitemap;
gulp_1.default.task('sitemap', getUntrackedSitemap);
var copyGen = function () {
    var deployDir = (0, gulp_deploy_1.deployConfig)().deployDir;
    return new bluebird_1.default(function (resolve) {
        gulp_1.default
            .src(['**/**', '!**/.git*', '!**/tmp/**', '!**/node_modules/**'], {
            cwd: (0, upath_1.join)(process.cwd(), 'public'),
            dot: true
        })
            .pipe(gulp_1.default.dest(deployDir))
            .on('error', console.trace)
            .once('end', function () { return getUntrackedSitemap().then(resolve); });
    });
};
// copy public to .deploy_git
gulp_1.default.task('copy', copyGen);
// deploy
gulp_1.default.task('deploy', gulp_1.default.series('pull', 'copy', 'safelink', 'commit', 'push'));
