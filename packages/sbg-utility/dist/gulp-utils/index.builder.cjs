'use strict';

var child_process = require('child_process');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');

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

var glob__namespace = /*#__PURE__*/_interopNamespaceDefault(glob);

// index.ts exports builder
// this only for development and excluded from build config
// create export
glob__namespace.glob('**/*.{ts,js,jsx,tsx}', { ignore: ['**/*.builder.*'], cwd: __dirname, posix: true }).then((files) => {
    const contents = files
        .filter((file) => !file.includes('.builder'))
        .map((file) => {
        return `export * from './${file.replace(/.(ts|js|tsx|jsx)$/, '')}';`;
    })
        .sort((a, b) => a.localeCompare(b) //using String.prototype.localCompare()
    );
    // dump
    console.log(contents);
    // fix eslint
    contents.push('', '//', '');
    fs.writeFileSync(path.join(__dirname, 'index.ts'), contents.join('\n'));
    child_process.spawnSync('eslint', ['--fix', 'src/**/*.ts'], { cwd: path.join(__dirname, '../..') });
});
