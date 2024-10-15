import fs from 'fs';
import { defaults } from 'jest-config';
import path from 'path';
import { type JestConfigWithTsJest } from 'ts-jest';

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

/**
 * @see {@link https://jestjs.io/docs/configuration}
 * * how to run single test {@link https://stackoverflow.com/questions/28725955/how-do-i-test-a-single-file-using-jest}
 */
const withCoverage: JestConfigWithTsJest = {
  globals: {
    __DEV__: true
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  verbose: false,
  cache: true,
  cacheDirectory: path.join(__dirname, 'tmp/jest'),
  collectCoverageFrom: [
    'src/*.{js,ts}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/test/**',
    '!**/*.test.{js,ts}',
    '!**/*.builder.ts',
    '!**/.deploy_git/**'
  ],
  roots: [`<rootDir>/test`],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/tmp/', '/test/'],
  // testPathIgnorePatterns: ['**/*.builder.*', '**/*.runner.*', '**/*.explicit.*'],
  testMatch: [
    `**/__tests__/**/*.+(ts|tsx|js)`,
    `**/?(*.)+(spec|test).+(ts|tsx|js)`,
    `**/test/*.test.ts`,
    '!**/.deploy_git/**'
  ],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
    '^.+\\.(ts|tsx)?$': [
      'ts-jest',
      {
        babelConfig: true,
        useESM: true,
        tsconfig: path.resolve(__dirname, 'tsconfig.jest.json')
      }
    ]
  },

  // detectLeaks: true,
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "\\\\node_modules\\\\"
  // ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8'

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],
};

[withCoverage.cacheDirectory]
  .filter((s) => typeof s === 'string')
  .forEach((s) => {
    if (!fs.existsSync(s)) fs.mkdirSync(s, { recursive: true });
  });

export default withCoverage;
