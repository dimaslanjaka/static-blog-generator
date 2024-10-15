// sbg-cli v2.0.0 Copyright (c) 2024 Dimas Lanjaka <dimaslanjaka@gmail.com> (https://webmanajemen.com)
'use strict';

var ansiColors = require('ansi-colors');
var sbgApi = require('sbg-api');

let api = new sbgApi.Application(process.env.SBG_CWD || process.cwd());
const rootColor = ansiColors.bgYellowBright.black('ROOT');
function getApi() {
    return api;
}
/**
 * change api cwd
 * @param root
 */
function setApi(root) {
    api = new sbgApi.Application(root);
}

exports.getApi = getApi;
exports.rootColor = rootColor;
exports.setApi = setApi;
