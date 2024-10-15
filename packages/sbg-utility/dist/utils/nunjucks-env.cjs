'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hutil = require('hexo-util');
var nunjucks = require('nunjucks');

function envNunjucks(loader, opts) {
    const env = new nunjucks.Environment(loader, opts);
    env.addFilter('uriencode', (str) => {
        return hutil.encodeURL(str);
    });
    env.addFilter('noControlChars', (str) => {
        return str.replace(/[\x00-\x1F\x7F]/g, ''); // eslint-disable-line no-control-regex
    });
    // Extract date from datetime
    env.addFilter('formatDate', (input) => {
        return input.toISOString().substring(0, 10);
    });
    return env;
}

exports.default = envNunjucks;
exports.envNunjucks = envNunjucks;
