'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs-extra');
var path = require('upath');
var indexExports = require('./index-exports.js');
var _config = require('./config/_config.js');
var configWrapper = require('./config/config-wrapper.js');
var defaultConfig = require('./config/default-config.js');
var gulpCache = require('./gulp-utils/gulp-cache.js');
var gulpDom = require('./gulp-utils/gulp-dom.js');
var gulp_debug = require('./gulp-utils/gulp.debug.js');
var sitemapCrawler = require('./sitemap-crawler/sitemap-crawler.js');
var array = require('./utils/array.js');
var chain = require('./utils/chain.js');
var date = require('./utils/date.js');
var debug = require('./utils/debug.js');
var casePath = require('./utils/filemanager/case-path.js');
var copy = require('./utils/filemanager/copy.js');
var del = require('./utils/filemanager/del.js');
var emptyDir = require('./utils/filemanager/emptyDir.js');
var getAppRootDir = require('./utils/filemanager/getAppRootDir.js');
var images = require('./utils/filemanager/images.js');
var normalizePath = require('./utils/filemanager/normalizePath.js');
var readDir = require('./utils/filemanager/readDir.js');
var stream = require('./utils/filemanager/stream.js');
var writefile = require('./utils/filemanager/writefile.js');
var index$3 = require('./utils/filemanager/index.js');
var findYarnRootWorkspace = require('./utils/findYarnRootWorkspace.js');
var hash = require('./utils/hash.js');
var isdev = require('./utils/isdev.js');
var jest = require('./utils/jest.js');
var JSONSerializer = require('./utils/JSON-serializer.js');
var JSON = require('./utils/JSON.js');
var logger = require('./utils/logger.js');
var noop = require('./utils/noop.js');
var nunjucksEnv = require('./utils/nunjucks-env.js');
var object = require('./utils/object.js');
var persistentCache = require('./utils/persistent-cache.js');
var promise = require('./utils/promise.js');
var promisify = require('./utils/promisify.js');
var scheduler = require('./utils/scheduler.js');
var semver = require('./utils/semver.js');
var stream$1 = require('./utils/stream.js');
var string = require('./utils/string.js');
var uuid = require('./utils/uuid.js');
var index = require('./utils/index.js');
var index$1 = require('./config/index.js');
var index$2 = require('./gulp-utils/index.js');
var globals = require('./globals.js');

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

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

//

exports.fs = fs__namespace;
exports.path = path__namespace;
exports.default = indexExports;
exports.commonIgnore = _config.commonIgnore;
exports.deployConfig = _config.deployConfig;
exports.fetchConfig = _config.fetchConfig;
exports.getConfig = _config.getConfig;
exports.main = _config;
exports.projectIgnores = _config.projectIgnores;
exports.setConfig = _config.setConfig;
exports.createConfig = configWrapper.createConfig;
exports.wrapper = configWrapper;
exports.defaults = defaultConfig;
exports.getDefaultConfig = defaultConfig.getDefaultConfig;
exports.getDefaultConfigYaml = defaultConfig.getDefaultConfigYaml;
exports.getShaFile = gulpCache.getShaFile;
exports.gulpCached = gulpCache.gulpCached;
exports.customPath = gulpDom.customPath;
exports.gulpDom = gulpDom.gulpDom;
exports.gulpDomPath = gulpDom.gulpDomPath;
exports.gulpDebug = gulp_debug.gulpDebug;
exports.gulpLog = gulp_debug.gulpLog;
exports.SiteMapCrawler = sitemapCrawler.SiteMapCrawlerCore;
exports.SiteMapCrawlerCore = sitemapCrawler.SiteMapCrawlerCore;
exports.sitemapCrawler = sitemapCrawler.sitemapCrawler;
exports.sitemapCrawlerAsync = sitemapCrawler.sitemapCrawlerAsync;
exports.arrayOfObjUniq = array.arrayOfObjUniq;
exports.array_flatten = array.array_flatten;
exports.array_random = array.array_random;
exports.array_remove_empty = array.array_remove_empty;
exports.array_shuffle = array.array_shuffle;
exports.array_shuffle_swap = array.array_shuffle_swap;
exports.array_unique = array.array_unique;
exports.rand = array.rand;
exports.chain = chain.chain;
exports.toMilliseconds = date.toMilliseconds;
exports.debug = debug.debug;
exports.sbgDebug = debug.sbgDebug;
exports.isWindows = casePath.isWindows;
exports.trueCasePath = casePath.trueCasePath;
exports.trueCasePathSync = casePath.trueCasePathSync;
exports.copyPath = copy.copyPath;
exports.del = del.del;
exports.emptyDir = emptyDir.emptyDir;
exports.getAppRootDir = getAppRootDir.getAppRootDir;
exports.image_base64_encode = images.image_base64_encode;
exports.fixDriveLetter = normalizePath.fixDriveLetter;
exports.joinPath = normalizePath.normalizePath;
exports.joinSolve = normalizePath.joinSolve;
exports.normalizePath = normalizePath.normalizePath;
exports.normalizePathUnix = normalizePath.normalizePathUnix;
exports.pathJoin = normalizePath.normalizePath;
exports.removeCwd = normalizePath.removeCwd;
exports.readDir = readDir.readDir;
exports.readDirAsync = readDir.readDirAsync;
exports.createWriteStream = stream.createWriteStream;
exports.writefile = writefile.writefile;
exports.isAsset = index$3.isAsset;
exports.isMarkdown = index$3.isMarkdown;
exports.findYarnRootWorkspace = findYarnRootWorkspace.findYarnRootWorkspace;
exports.data_to_hash = hash.data_to_hash;
exports.data_to_hash_sync = hash.data_to_hash_sync;
exports.file_to_hash = hash.file_to_hash;
exports.folder_to_hash = hash.folder_to_hash;
exports.md5 = hash.md5;
exports.md5FileSync = hash.md5FileSync;
exports.url_to_hash = hash.url_to_hash;
exports.isdev = isdev.isdev;
exports.areWeTestingWithJest = jest.areWeTestingWithJest;
exports.fromJSON = JSONSerializer.fromJSON;
exports.parse = JSONSerializer.parse;
exports.stringify = JSONSerializer.stringify;
exports.toJSON = JSONSerializer.toJSON;
exports.jsonParseWithCircularRefs = JSON.jsonParseWithCircularRefs;
exports.jsonStringifyWithCircularRefs = JSON.jsonStringifyWithCircularRefs;
exports.Logger = logger.Logger;
exports.noop = noop.noop;
exports.envNunjucks = nunjucksEnv.envNunjucks;
exports.getObjectProperty = object.getObjectProperty;
exports.orderKeys = object.orderKeys;
exports.persistentCache = persistentCache.persistentCache;
exports.safeCb = persistentCache.safeCb;
exports.delay = promise.delay;
exports.promisify = promisify.promisify;
exports.bindProcessExit = scheduler.bindProcessExit;
exports.scheduler = scheduler.scheduler;
exports.semver = semver.semver;
exports.semverIncrement = semver.semverIncrement;
exports.createDuplexStream = stream$1.createDuplexStream;
exports.bufferToString = string.bufferToString;
exports.capitalize = string.capitalize;
exports.capitalizer = string.capitalizer;
exports.escapeRegex = string.escapeRegex;
exports.isValidHttpUrl = string.isValidHttpUrl;
exports.replacePath = string.replacePath;
exports.slugify = string.slugify;
exports.streamToString = string.streamToString;
exports.makeid = uuid.makeid;
exports.utils = index;
exports.config = index$1;
exports.gutils = index$2;
exports.globals = globals;
