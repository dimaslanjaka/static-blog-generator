import merge from 'deepmerge-ts';
import base from '../../jest.config';

module.exports = {
  ...merge.deepmerge(base, {
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json'
      }
    }
  }),
  rootDir: 'src',
  testRegex: [/.*\.spec\.ts$/]
};
