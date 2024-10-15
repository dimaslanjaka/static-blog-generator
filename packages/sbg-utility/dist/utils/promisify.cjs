'use strict';

var Bluebird = require('bluebird');

/**
 * make any function or value to be promise
 * @param func
 * @param options
 * @returns
 */
const promisify = Bluebird.promisify;

exports.promisify = promisify;
