import fs from 'fs';
import jsonc from 'jsonc-parser';

const jparse = jsonc.parse;
const parsed = jparse(fs.readFileSync(__dirname + '/tsconfig.json').toString(), [], {
  allowTrailingComma: true,
  disallowComments: false
});

const config: Extract<NonNullable<import('jest').Config['projects']>[number], Record<string, any>> = {
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      // required due to custom location of tsconfig.json configuration file
      // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
      { tsconfig: parsed.compilerOptions }
    ]
  }
};

export default config;
