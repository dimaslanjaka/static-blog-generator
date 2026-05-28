const { execSync } = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs-extra');
const path = require('upath');

/**
 * @typedef {Object} FileEntry
 * @property {string} file
 * @property {string} hash
 */

dotenv.config({
  quiet: true,
  override: true,
  path:
    [path.resolve(__dirname, '.env'), path.resolve(process.cwd(), '.env')].filter((p) => fs.existsSync(p))[0] ||
    undefined
});

/**
 * Main entry
 * @returns {Promise<void>}
 */
async function main() {
  try {
    execSync(
      'npx -y run-c --pattern="src/**/*.{ts,js,cjs,mjs}" --pattern="tsconfig*.json" --pattern="rollup.*" --ignore="**/node_modules/**" --ignore="**/dist/**" --ignore="**/tmp/**" --ignore="**/coverage/**" --ignore="**/.git/**" --ignore="**/index.*" --ignore="**/*.builder*" --ignore="**/*.runner*" --ignore="**/*export*" --exec="npm run build"',
      {
        stdio: 'inherit',
        cwd: __dirname
      }
    );

    console.log('🛠️\tBuild completed.');
  } catch (error) {
    console.error('❌\tBuild failed. ' + (error instanceof Error ? error.message : String(error)));

    process.exit(1);
  }
}

module.exports = main;
