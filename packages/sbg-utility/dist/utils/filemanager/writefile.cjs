'use strict';

var fs = require('fs-extra');
var path = require('upath');

/**
 * sync write to file recursively (auto create dirname)
 * @param file
 * @param content
 * @param opt
 */
function writefile(file, content, opt = {}) {
    // create dirname when not exist
    if (!fs.existsSync(path.dirname(file)))
        fs.mkdirSync(path.dirname(file), Object.assign({ recursive: true }, opt));
    const result = {
        file,
        append: false
    };
    // transform object
    if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2);
    }
    if (opt.append) {
        result.append = true;
        fs.appendFileSync(file, content);
    }
    else {
        fs.writeFileSync(file, content);
    }
    if (opt.async)
        return Promise.resolve(result);
    return result;
}

exports.writefile = writefile;
