// sbg-cli v2.0.0 Copyright (c) 2024 Dimas Lanjaka <dimaslanjaka@gmail.com> (https://webmanajemen.com)
'use strict';

var sbgApi = require('sbg-api');
var SBGServer = require('sbg-server');
var utility = require('sbg-utility');

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

var sbgApi__namespace = /*#__PURE__*/_interopNamespaceDefault(sbgApi);
var utility__namespace = /*#__PURE__*/_interopNamespaceDefault(utility);

function cli() {
    Promise.resolve().then(function () { return require('./cli.cjs'); });
}

exports.api = sbgApi__namespace;
exports.server = SBGServer;
exports.utility = utility__namespace;
exports.cli = cli;
