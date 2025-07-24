import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getChecksum } from './src/utils/hash';

/**
 * __dirname workaround for ESM modules (Node.js standard)
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const checksum = getChecksum('rollup.*', 'tsconfig.json', 'package.json', 'src/**/*.{ts,js,cjs,mjs}');
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
