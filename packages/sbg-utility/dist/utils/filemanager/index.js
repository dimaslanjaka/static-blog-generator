'use strict';

var copy = require('./copy.js');
var del = require('./del.js');
var emptyDir = require('./emptyDir.js');
var getAppRootDir = require('./getAppRootDir.js');
var images = require('./images.js');
var normalizePath = require('./normalizePath.js');
var readDir = require('./readDir.js');
var stream = require('./stream.js');
var writefile = require('./writefile.js');

// filemanager
/**
 * is non-markdown file
 * @param path
 * @returns
 */
const isAsset = (path) => /.(js|css|scss|njk|ejs|png|jpe?g|gif|svg|webp|json|html|txt)$/.test(String(path));
/**
 * is markdown file
 * @param path
 * @returns
 */
const isMarkdown = (path) => /.(md)$/i.test(String(path));

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
exports.isAsset = isAsset;
exports.isMarkdown = isMarkdown;
