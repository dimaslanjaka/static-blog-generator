'use strict';

/**
 * async delayed
 * @param ms milliseconds
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.delay = delay;
