import Bluebird from 'bluebird';

/**
 * make any function or value to be promise
 * @param func
 * @param options
 * @returns
 */
const promisify = Bluebird.promisify;

export { promisify };
