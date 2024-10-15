'use strict';

/**
 * check development NODE_ENV
 * @returns
 */
function isdev() {
    return /dev/i.test(process.env.NODE_ENV || '');
}

exports.isdev = isdev;
