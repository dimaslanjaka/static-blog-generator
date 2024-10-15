'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var spawn = require('cross-spawn');
var gulp = require('gulp');
var sbgUtils = require('sbg-utility');
var through2 = require('through2');
var path = require('upath');

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

var spawn__namespace = /*#__PURE__*/_interopNamespaceDefault(spawn);

/**
 * run all _*.standalone.js inside src-posts (_config_yml.post_dir)
 * @returns
 */
function standaloneRunner() {
    sbgUtils.Logger.log('[standalone] Running scripts...\n');
    return gulp
        .src(path.join(sbgUtils.getConfig().cwd, '**/_*.standalone.js'), { cwd: sbgUtils.getConfig().cwd, ignore: ['**/tmp/**'] })
        .pipe(through2.obj(async function (file, _enc, next) {
        sbgUtils.Logger.log('='.repeat(10) + ' input ' + '='.repeat(10));
        sbgUtils.Logger.log(`node ${await sbgUtils.replacePath(file.path, sbgUtils.getConfig().cwd, '')}`);
        sbgUtils.Logger.log('='.repeat(10) + ' ouput ' + '='.repeat(10));
        const child = spawn__namespace.spawn('node', [file.path], { stdio: 'inherit' });
        child.on('close', () => {
            // drop file
            next();
        });
    }))
        .pipe(gulp.dest(path.join(sbgUtils.getConfig().cwd, 'tmp/standalone')))
        .once('end', function () {
        sbgUtils.Logger.log('\n[standalone] stopped');
    });
}

exports.default = standaloneRunner;
