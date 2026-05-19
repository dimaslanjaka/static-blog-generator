const path = require('path');
const ansiColors = require('ansi-colors');
const cp = require('cross-spawn');
const fs = require('fs');

const projectDir = path.join(__dirname, '..');
const rollupConfigPath = path.join(projectDir, 'rollup.executor.js');

if (!process.env.ROLLUP_INPUT) {
  console.error('Error: ROLLUP_INPUT environment variable is not set.');
  process.exit(1);
}

if (!process.env.ROLLUP_OUTPUT) {
  const inputPath = path.resolve(projectDir, process.env.ROLLUP_INPUT);
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  process.env.ROLLUP_OUTPUT = path.join(dir, baseName + '.cjs');
  console.log(`Set ROLLUP_OUTPUT to: ${ansiColors.cyan(process.env.ROLLUP_OUTPUT)}`);
}

cp.sync('npx', ['rollup', '-c', rollupConfigPath], {
  stdio: 'inherit',
  shell: true,
  cwd: projectDir
});

// execute the output file
cp.sync('node', ['--no-warnings', `${process.env.ROLLUP_OUTPUT.replace(/\.cjs$/, '.mjs')}`], {
  stdio: 'inherit',
  shell: true,
  cwd: projectDir
});

// delete the output files after execution
const output = process.env.ROLLUP_OUTPUT;

if (output && typeof output === 'string') {
  [
    output.replace(/\.cjs$/, '.mjs'),
    output.replace(/\.cjs$/, '.d.ts'),
    output.replace(/\.cjs$/, '.mts'),
    output.replace(/\.cjs$/, '.cts'),
    output
  ]
    // avoid deleting unexpected paths
    .filter((file) => file && file !== '.' && file !== '/')
    // avoid duplicate deletes when replace() doesn't change the name
    .filter((file, index, arr) => arr.indexOf(file) === index)
    .forEach((file) => {
      try {
        fs.rmSync(file, { force: true });
      } catch (err) {
        console.warn(`Failed to remove ${file}:`, err);
      }
    });
}
