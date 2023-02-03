import tsconfigTest from './tsconfig.json';

const config: Extract<NonNullable<import('jest').Config['projects']>[number], Record<string, any>> = {
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      // required due to custom location of tsconfig.json configuration file
      // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
      { tsconfig: tsconfigTest.compilerOptions }
    ]
  }
};

export default config;
