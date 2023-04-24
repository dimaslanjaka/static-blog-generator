import path from 'path';
import tsconfigTest from './tsconfig.test.json';

const config: Extract<NonNullable<import('jest').Config['projects']>[number], Record<string, any>> = {
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      // required due to custom location of tsconfig.json configuration file
      // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
      { tsconfig: tsconfigTest.compilerOptions }
    ]
  },
  cacheDirectory: path.join(__dirname, 'tmp/jest'),
  cache: true,
  detectLeaks: true,
  detectOpenHandles: true,
  displayName: 'CLI',
  coveragePathIgnorePatterns: ['**/test/**', '**/node_modules/**', '**/dist/**']
};

export default config;
