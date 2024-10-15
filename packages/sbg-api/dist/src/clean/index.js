'use strict';

var cleanArchive = require('./cleanArchive.js');
var cleanDb = require('./cleanDb.js');
var cleanGeneratedPosts = require('./cleanGeneratedPosts.js');



exports.cleanArchive = cleanArchive.default;
exports.cleanDb = cleanDb.cleanDb;
exports.cleanGeneratedPosts = cleanGeneratedPosts.cleanGeneratedPosts;
