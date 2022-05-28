import { readdirSync } from './node/filemanager';

// eslint ./src --ext .ts --fix > dump-eslint.log
const cmds: string[][] = [];
for (const file of readdirSync(__dirname)) {
  if (file.endsWith('.ts') && !file.endsWith('.test.ts'))
    cmds.push(['eslint', file, '--fix']);
}
