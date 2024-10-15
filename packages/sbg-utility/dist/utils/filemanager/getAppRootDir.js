'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs-extra');
var path = require('upath');
var casePath = require('./case-path.js');

function getAppRootDir() {
    let currentDir = __dirname;
    while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
        currentDir = path.join(currentDir, '..');
    }
    return path.toUnix(casePath.trueCasePathSync(currentDir));
}

exports.default = getAppRootDir;
exports.getAppRootDir = getAppRootDir;
