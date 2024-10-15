import { spawnSync } from 'child_process';
import fs__default from 'fs-extra';
import * as glob from 'glob';
import url from 'node:url';
import path__default from 'path';

// index.ts exports builder
// this only for development and excluded from build config
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path__default.dirname(__filename);
// create export
glob.glob('**/*.{ts,js,jsx,tsx,cjs,mjs}', { ignore: ['**/*.builder.*'], cwd: __dirname, posix: true }).then((files) => {
    const contents = files
        .filter((file) => !file.includes('.builder'))
        .map((file) => {
        return `export * from './${file.replace(/.(ts|js|tsx|jsx)$/, '')}';`;
    })
        .sort((a, b) => a.localeCompare(b) //using String.prototype.localCompare()
    );
    // dump
    console.log(contents);
    // fix eslint
    contents.push('', '//', '');
    fs__default.writeFileSync(path__default.join(__dirname, 'index.ts'), contents.join('\n'));
    spawnSync('eslint', ['--fix', 'src/**/*.ts'], { cwd: path__default.join(__dirname, '../..') });
});
