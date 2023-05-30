import { defaults } from 'jest-config';
import { join } from 'path';
import sbgApiConfig from './packages/sbg-api/jest.config';
import sbgMainConfig from './packages/sbg-cli/jest.config';
import sbgUtilityConfig from './packages/sbg-utility/jest.config';

const globalIgnores: import('jest').Config = {
  transformIgnorePatterns: ['**/dist/**', '**/tmp/**'],
  modulePathIgnorePatterns: ['**/dist/**', '**/tmp/**'],
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist', '**/tmp/**', '**/node_modules/**', '**/dist/**']
};

/**
 * @see {@link https://jestjs.io/docs/configuration}
 * * how to run single test {@link https://stackoverflow.com/questions/28725955/how-do-i-test-a-single-file-using-jest}
 */
const config: import('jest').Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  verbose: false,
  cache: true,
  cacheDirectory: join(__dirname, 'tmp/jest'),
  rootDir: __dirname,
  roots: [
    '<rootDir>/packages/sbg-cli',
    '<rootDir>/packages/sbg-api',
    '<rootDir>/packages/sbg-utility',
    '<rootDir>/packages/sbg-server'
  ],

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
    '<rootDir>/packages/sbg-*/src/**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/test/**',
    '!**/dist/**',
    '!**/tmp/**',
    '!**/*.{test,spec}.{js,ts}'
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: '<rootDir>/coverage',

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
  ],

  ...globalIgnores,
  projects: [
    {
      displayName: 'CLI',
      testMatch: ['<rootDir>/packages/sbg-cli/test/**/*.{test,spec}.{ts,js}'],
      ...sbgMainConfig
    },
    {
      displayName: 'API',
      testMatch: ['<rootDir>/packages/sbg-api/test/**/*.{test,spec}.{ts,js}'],
      ...sbgApiConfig
    },
    {
      displayName: 'UTILITY',
      testMatch: ['<rootDir>/packages/sbg-utility/test/**/*.{test,spec}.{ts,js}'],
      ...sbgUtilityConfig
    },
    {
      displayName: 'HPP',
      testMatch: ['<rootDir>/packages/hexo-post-parser/test/**/*.{test,spec}.{ts,js}'],
      ...sbgUtilityConfig
    }
  ]
};

export default config;
