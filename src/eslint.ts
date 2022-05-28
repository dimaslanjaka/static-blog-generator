/* eslint-disable no-control-regex */
// eslint ./src --ext .ts --fix > dump-eslint.log
/*const cmds: string[][] = [];
for (const file of readdirSync(__dirname)) {
  if (file.endsWith('.ts') && !file.endsWith('.test.ts'))
    cmds.push(['eslint', file, '--fix']);
}*/
import { ESLint } from 'eslint';
import { rmSync } from 'fs';
import { join } from 'path';
import { readdirSync, write } from './node/filemanager';
import { cwd } from './types/_config';

const outputLog = join(__dirname, '../dump-eslint.log');
rmSync(outputLog);

(async () => {
  for (const file of readdirSync(__dirname)) {
    if (
      file.endsWith('.ts') &&
      !file.endsWith('.test.ts') &&
      !file.endsWith('eslint.ts')
    ) {
      console.log(`linting ${file.replace(cwd(), '')}`);
      try {
        await runEslint(file);
      } catch (error) {
        process.exitCode = 1;
        console.error(error);
      }
    }
  }
})();

async function runEslint(filePath = 'src/**/*.ts') {
  // 1. Create an instance with the `fix` option.
  const eslint = new ESLint({ fix: true, cwd: join(__dirname, '..') });

  const _config = await eslint.calculateConfigForFile(
    join(__dirname, '../.eslintrc')
  );

  //const isPathIgnored = await eslint.isPathIgnored(filePath);

  // 2. Lint files. This doesn't modify target files.
  const results = await eslint.lintFiles([filePath]);

  // 3. Modify the files with the fixed code.
  await ESLint.outputFixes(results);

  // 4. Format the results.
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = await formatter.format(results);

  // 5. Output it.
  write(
    outputLog,
    resultText.replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ''
    ),
    true
  );
}
