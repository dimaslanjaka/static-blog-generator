import fs from 'fs';
import { defaults } from 'jest-config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @see https://jestjs.io/docs/configuration
 * @see https://stackoverflow.com/questions/28725955/how-do-i-test-a-single-file-using-jest
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  verbose: true,
  cache: true,
  cacheDirectory: path.join(__dirname, 'tmp/jest'),
  bail: 1,
  collectCoverageFrom: [
    'src/*.{js,ts}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/test/**',
    '!**/*.test.{js,ts}',
    '!**/*.builder.ts',
    '!**/*.runner.ts',
    '!**/.deploy_git/**'
  ],

  roots: ['<rootDir>/test'],

  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/tmp/', '/test/'],

  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|[cm]js)',
    '**/?(*.)+(spec|test).+(js|ts|tsx|[cm]js)',
    '**/test/*.test.{js,ts,cjs,mjs}',
    '**/test/*.spec.{js,ts,cjs,mjs}',
    '!**/.deploy_git/**'
  ],

  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },

  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        babelConfig: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { node: 'current' }
              }
            ],
            '@babel/preset-typescript'
          ]
        },
        useESM: true,
        tsconfig: path.join(__dirname, 'tsconfig.jest.json')
      }
    ],

    '^.+\\.cjs$': [
      'babel-jest',
      {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: { node: 'current' }
            }
          ]
        ]
      }
    ]
  },

  // detectLeaks: true,
  // detectOpenHandles: true,

  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  setupFiles: ['<rootDir>/jest.setup.ts']
};

// Ensure the 'tmp' directory exists before using it for Jest cache
const tmpDir = path.join(__dirname, 'tmp');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

if (!fs.existsSync(/** @type {string} */ (config.cacheDirectory))) {
  fs.mkdirSync(/** @type {string} */ (config.cacheDirectory), {
    recursive: true
  });
}

export default config;
