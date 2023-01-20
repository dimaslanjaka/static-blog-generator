import fs from 'fs';
import { Config } from 'jest';
import path from 'upath';
import base from '../../jest.config';
import tsconfigTest from './tsconfig.test.json';

const config: Config = {
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      // required due to custom location of tsconfig.json configuration file
      // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
      { tsconfig: tsconfigTest.compilerOptions }
    ]
  },
  rootDir: 'test',
  // coverage directory
  coverageDirectory: path.join(__dirname, 'coverage')
};

const merged = Object.assign(base, config);
merged.roots?.push(__dirname + '/test');
merged.roots?.push(__dirname);
if (merged.roots) {
  merged.roots = merged.roots.filter(fs.existsSync);
}

export default merged;
