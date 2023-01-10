import { Config } from 'jest';
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
  rootDir: 'test'
};

const merged = Object.assign(base, config);
merged.roots?.push(__dirname + '/test');
merged.roots?.push(__dirname);

export default merged;
