'use strict';

var _config = require('./_config.cjs');
var configWrapper = require('./config-wrapper.cjs');
var defaultConfig = require('./default-config.cjs');

//

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
