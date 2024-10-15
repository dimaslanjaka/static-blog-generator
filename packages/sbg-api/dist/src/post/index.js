'use strict';

var copy = require('./copy.js');
var getSourcePosts = require('./get-source-posts.js');
require('cross-spawn');
require('gulp');
require('sbg-utility');
require('through2');
require('upath');
var update = require('./update.js');

//

exports.copyAllPosts = copy.copyAllPosts;
exports.copySinglePost = copy.copySinglePost;
exports.processSinglePost = copy.processSinglePost;
exports.getSourcePosts = getSourcePosts.getSourcePosts;
exports.updatePost = update.updatePost;
