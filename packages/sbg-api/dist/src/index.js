'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var indexExports = require('./index-exports.js');
var api = require('./api.js');
var index = require('./clean/index.js');
var index$1 = require('./feed/index.js');
var gulp_safelink = require('./gulp.safelink.js');
var gulp_seo = require('./gulp.seo.js');
var index$2 = require('./post/index.js');
var index$3 = require('./sitemap/index.js');
var cleanArchive = require('./clean/cleanArchive.js');
var cleanDb = require('./clean/cleanDb.js');
var cleanGeneratedPosts = require('./clean/cleanGeneratedPosts.js');
var copy = require('./post/copy.js');
var getSourcePosts = require('./post/get-source-posts.js');
var update = require('./post/update.js');



exports.default = indexExports;
exports.Application = api.default;
exports.SBG = api.default;
exports.clean = index;
exports.feed = index$1;
exports.gulpHexoGeneratedFeed = index$1.gulpHexoGeneratedFeed;
exports.hexoGenerateFeed = index$1.hexoGenerateFeed;
exports.safelink = gulp_safelink;
exports.taskSafelink = gulp_safelink.taskSafelink;
exports.seo = gulp_seo;
exports.taskSeo = gulp_seo.taskSeo;
exports.post = index$2;
exports.generateSitemap = index$3.generateSitemap;
exports.hexoGenerateSitemap = index$3.hexoGenerateSitemap;
exports.sitemap = index$3;
exports.cleanArchive = cleanArchive.default;
exports.cleanDb = cleanDb.cleanDb;
exports.cleanGeneratedPosts = cleanGeneratedPosts.cleanGeneratedPosts;
exports.copyAllPosts = copy.copyAllPosts;
exports.copySinglePost = copy.copySinglePost;
exports.processSinglePost = copy.processSinglePost;
exports.getSourcePosts = getSourcePosts.getSourcePosts;
exports.updatePost = update.updatePost;
