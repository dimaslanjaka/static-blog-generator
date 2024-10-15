'use strict';

var gulpCache = require('./gulp-cache.cjs');
var gulpDom = require('./gulp-dom.cjs');
var gulp_debug = require('./gulp.debug.cjs');

//

exports.getShaFile = gulpCache.getShaFile;
exports.gulpCached = gulpCache.gulpCached;
exports.customPath = gulpDom.customPath;
exports.gulpDom = gulpDom.gulpDom;
exports.gulpDomPath = gulpDom.gulpDomPath;
exports.gulpDebug = gulp_debug.gulpDebug;
exports.gulpLog = gulp_debug.gulpLog;
