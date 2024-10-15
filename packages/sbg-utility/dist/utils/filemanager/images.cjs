'use strict';

var fs = require('fs-extra');

/**
 * function to encode file data to base64 encoded string
 * @param file path file
 * @returns
 */
function image_base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return bitmap.toString('base64');
}

exports.image_base64_encode = image_base64_encode;
