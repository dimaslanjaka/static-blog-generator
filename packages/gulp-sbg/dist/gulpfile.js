"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitProject = void 0;
var gulp_1 = __importDefault(require("gulp"));
var hexo_util_1 = require("hexo-util");
var upath_1 = require("upath");
require("./gulp.clean");
var gulp_deploy_1 = require("./gulp.deploy");
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
var copyGen = function () {
    var deployDir = (0, gulp_deploy_1.deployConfig)().deployDir;
    return gulp_1.default
        .src(['**/**', '!**/.git*', '!**/tmp/**', '!**/node_modules/**'], {
        cwd: (0, upath_1.join)(process.cwd(), 'public'),
        dot: true
    })
        .pipe(gulp_1.default.dest(deployDir))
        .on('error', console.trace);
};
// copy public to .deploy_git
gulp_1.default.task('copy', copyGen);
// deploy
gulp_1.default.task('deploy', gulp_1.default.series('pull', 'copy', 'safelink', 'commit', 'push'));
