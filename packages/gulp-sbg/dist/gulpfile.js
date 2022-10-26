"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUntrackedSitemap = exports.commitProject = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const fs_1 = require("fs");
const gulp_1 = __importDefault(require("gulp"));
const hexo_util_1 = require("hexo-util");
const sitemap_crawler_1 = require("sitemap-crawler");
const upath_1 = require("upath");
const deploy_1 = require("./deploy");
require("./gulp.clean");
require("./gulp.feed");
require("./gulp.post");
require("./gulp.safelink");
// commit current project
function commitProject(finish) {
    const gitDirs = [(0, upath_1.join)(process.cwd(), 'src-posts'), (0, upath_1.join)(process.cwd(), 'source'), process.cwd()];
    const commit = () => {
        if (!gitDirs.length)
            return finish();
        const gitDir = gitDirs[0];
        const opt = {
            cwd: gitDir,
            stdio: 'inherit'
        };
        return (0, hexo_util_1.spawn)('git', ['add', '-A'], opt)
            .then(() => (0, hexo_util_1.spawn)('git', ['commit', '-m', 'update ' + new Date()], opt))
            .catch((e) => {
            if (e instanceof Error)
                console.log(e.message, gitDir);
        })
            .finally(() => {
            gitDirs.shift();
            commit();
        });
    };
    return commit();
}
exports.commitProject = commitProject;
gulp_1.default.task('project-commit', commitProject);
function getUntrackedSitemap() {
    return new bluebird_1.default((resolve) => {
        const { deployDir } = (0, deploy_1.deployConfig)();
        const originfile = (0, upath_1.join)(process.cwd(), 'public/sitemap.txt');
        const outfile = (0, upath_1.join)(deployDir, 'sitemap.txt');
        let sitemaps = (0, fs_1.readFileSync)(originfile, 'utf-8').split(/\r?\n/gm);
        (0, sitemap_crawler_1.sitemapCrawlerAsync)('https://www.webmanajemen.com/chimeraland', {
            deep: 2
        }).then((results) => {
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
const copyGen = () => {
    const { deployDir } = (0, deploy_1.deployConfig)();
    return new bluebird_1.default((resolve) => {
        gulp_1.default
            .src(['**/**', '!**/.git*', '!**/tmp/**', '!**/node_modules/**'], {
            cwd: (0, upath_1.join)(process.cwd(), 'public'),
            dot: true
        })
            .pipe(gulp_1.default.dest(deployDir))
            .on('error', console.trace)
            .once('end', () => getUntrackedSitemap().then(resolve));
    });
};
// copy public to .deploy_git
gulp_1.default.task('copy', copyGen);
// deploy
gulp_1.default.task('deploy', gulp_1.default.series('pull', 'copy', 'safelink', 'commit', 'push'));
