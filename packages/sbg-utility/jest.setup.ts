import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getChecksumWithOptions } from './src/utils/index';
import dotenv from 'dotenv';

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

const checksum = getChecksumWithOptions(
  { ignorePatterns: ['*export*', '*.builder*', '*.runner*', '*.direct*'] },
  'rollup.*',
  'tsconfig.json',
  'package.json',
  'src/**/*.{ts,js,cjs,mjs}'
);
const tmpDir = path.resolve(__dirname, 'tmp');
fs.mkdirSync(tmpDir, { recursive: true });
const checksumFile = path.join(tmpDir, 'checksum.txt');

// Ensure tmp directory exists
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

// Read previous checksum if exists
let previousChecksum = '';
if (fs.existsSync(checksumFile)) {
  previousChecksum = fs.readFileSync(checksumFile, 'utf8');
}

// Check if checksum changed
const isChecksumChanged: boolean = previousChecksum !== checksum;

if (isChecksumChanged) {
  // Run build if checksum changed
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
    console.log('🛠️ Build completed.');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Write checksum at process exit if changed
process.on('exit', () => {
  if (isChecksumChanged) {
    fs.writeFileSync(checksumFile, checksum);
    console.log('✅ Checksum updated.');
  }
});
