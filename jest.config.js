const { join } = require('path');

/**
 * @type {import('jest').Config}
 * @see {@link https://jestjs.io/docs/configuration}
 * * how to run single test {@link https://stackoverflow.com/questions/28725955/how-do-i-test-a-single-file-using-jest}
 */
const config = {
  verbose: true,
  cacheDirectory: join(__dirname, 'tmp/jest'),
  collectCoverageFrom: ['src/*.{js,ts}', '!**/node_modules/**', '!**/vendor/**'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/tmp/'],
  testMatch: ['<rootDir>/test/**']
};

module.exports = config;
