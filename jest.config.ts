import type { Config } from 'jest';
import { defaults } from 'jest-config';
import { join } from 'path';

/**
 * @type {import('jest').Config}
 * @see {@link https://jestjs.io/docs/configuration}
 * * how to run single test {@link https://stackoverflow.com/questions/28725955/how-do-i-test-a-single-file-using-jest}
 */
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  verbose: false,
  cache: true,
  cacheDirectory: join(__dirname, 'tmp/jest'),
  roots: [`<rootDir>/packages/sbg-main/test`],

  testMatch: [`**/__tests__/**/*.+(ts|tsx|js)`, `**/?(*.)+(spec|test).+(ts|tsx|js)`],

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      // required due to custom location of tsconfig.json configuration file
      // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
      { tsconfig: './tsconfig.test.json' }
    ]
  },

  // detectLeaks: true,
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '**/*.{js,ts}',
    './packages/**/src/**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/test/**',
    '!**/*.{test,spec}.{js,ts}'
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['\\\\node_modules\\\\', '/node_modules/', '/dist/', '/tmp/', '/test/'],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: join(__dirname, '/coverage/html-report'),
        filename: 'report.html',
        openReport: false
      }
    ]
  ]
};

export default config;
