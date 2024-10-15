'use strict';

var fs = require('fs-extra');
var path = require('upath');

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

/**
 * create writestream (auto create dirname)
 * @param dest
 * @param options
 * @returns
 */
function createWriteStream(dest, options) {
    if (!fs__namespace.existsSync(path__namespace.dirname(dest)))
        fs__namespace.mkdirSync(path__namespace.dirname(dest));
    return fs__namespace.createWriteStream(dest, options);
}

exports.createWriteStream = createWriteStream;
