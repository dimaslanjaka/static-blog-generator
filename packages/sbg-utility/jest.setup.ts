import { execSync } from 'child_process';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getFileChanges } from './src/utils/index.js';
import ansi from 'ansi-colors';

/**
 * __dirname workaround for ESM modules (Node.js standard)
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  quiet: true,
  override: true,
  path:
    [path.resolve(__dirname, '.env'), path.resolve(process.cwd(), '.env')].filter((p) => fs.existsSync(p))[0] ||
    undefined
});

async function main() {
  const changed = await getFileChanges({
    ignorePatterns: [
      '*export*',
      '*.builder*',
      '*.runner*',
      '*.direct*',
      '**/node_modules/**',
      '**/dist/**',
      '**/tmp/**',
      '**/coverage/**',
      '**/.git/**',
      '**/index.*',
      '**/test*/**',
      '**/*.test.*',
      '**/__tests__/**'
    ],
    patterns: ['rollup.*', 'tsconfig*.json', 'src/**/*.{ts,js,cjs,mjs}'],
    cwd: __dirname
  });

  if (changed.result) {
    console.log(
      `🛠️\tDetected changes in source files ${changed.changedFiles.map((f) => ansi.yellow(path.relative(__dirname, f.file))).join(', ')}. Running build...`
    );
    // Run build if changed
    try {
      execSync('npm run build', { stdio: 'ignore', cwd: __dirname });
      console.log('🛠️\tBuild completed.');
    } catch (error) {
      console.error('❌\tBuild failed:', error);
      process.exit(1);
    }
  } else {
    console.log('✅\tNo relevant source files changed. Skipping build.');
  }
}
main();
