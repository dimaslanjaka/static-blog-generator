'use strict';

var gulpCache = require('./gulp-cache.js');
var gulpDom = require('./gulp-dom.js');
var gulp_debug = require('./gulp.debug.js');

//

exports.getShaFile = gulpCache.getShaFile;
exports.gulpCached = gulpCache.gulpCached;
exports.customPath = gulpDom.customPath;
exports.gulpDom = gulpDom.gulpDom;
exports.gulpDomPath = gulpDom.gulpDomPath;
exports.gulpDebug = gulp_debug.gulpDebug;
exports.gulpLog = gulp_debug.gulpLog;
