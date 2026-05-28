import path from 'upath';
import { spawnSync } from 'node:child_process';

/**
 * lint-staged configuration:
 * - Groups staged files by package (packages/<name>) or root.
 * - Runs eslint, prettier, php-cs-fixer, and black in each group's directory.
 * - Passes absolute file paths so tools can resolve files reliably.
 */

/**
 * Normalizes a staged file path to a repo-relative Unix-style path.
 * @param {string} file
 * @returns {string}
 */
function normalizeStagedFile(file) {
  const relative = path.isAbsolute(file) ? path.relative(process.cwd(), file) : file;
  return path.toUnix(relative);
}

/**
 * Groups files by their package directory.
 * @param {string[]} files - List of file paths.
 * @returns {Record<string, string[]>} - Files grouped by package.
 */
function groupByPackage(files) {
  const groups = {
    root: []
  };

  for (const originalFile of files) {
    const file = normalizeStagedFile(originalFile);

    if (file.startsWith('packages/')) {
      const [, pkg, ...rest] = file.split('/');
      const key = `packages/${pkg}`;
      const relative = rest.join('/');
      if (!groups[key]) groups[key] = [];
      groups[key].push(relative);
    } else {
      groups.root.push(file);
    }
  }

  return groups;
}

/**
 * Builds a command with absolute file arguments.
 * @param {string} cwd
 * @param {string[]} command
 * @param {string[]} files
 * @returns {string}
 */
function toCmd(cwd, command, files) {
  const baseDir = cwd === 'root' ? '.' : cwd;
  const escaped = files
    .map((file) => path.toUnix(path.resolve(baseDir, file)))
    .map((file) => `"${file}"`)
    .join(' ');

  return `${command.join(' ')} ${escaped}`;
}

/**
 * Executes grouped commands in their package directories.
 * @param {string[]} files
 * @param {string[]} command
 * @returns {Promise<void>}
 */
async function runGrouped(files, command) {
  const groups = groupByPackage(files);

  for (const [cwd, fs] of Object.entries(groups)) {
    if (fs.length === 0) continue;

    const baseDir = cwd === 'root' ? '.' : cwd;
    const cmd = toCmd(cwd, command, fs);
    const result = spawnSync(cmd, {
      cwd: path.resolve(baseDir),
      stdio: 'inherit',
      shell: true
    });

    if (result.error) throw result.error;
    if (typeof result.status === 'number' && result.status !== 0) {
      throw new Error(`Command failed: ${cmd}`);
    }
  }
}

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '**/*.{js,cjs,mjs,ts,jsx,tsx}': {
    title: 'eslint --fix',
    task: (files) => runGrouped(files, ['npx', '--no-install', 'eslint', '--fix'])
  },

  '**/*.{json,css,scss,less,yml,yaml,sql}': {
    title: 'prettier --write',
    task: (files) => runGrouped(files, ['npx', '--no-install', 'prettier', '--write'])
  },

  '**/*.php': {
    title: 'php-cs-fixer',
    task: (files) => runGrouped(files, ['composer', 'exec', 'php-cs-fixer', 'fix'])
  },

  '**/*.py': {
    title: 'black',
    task: (files) => runGrouped(files, ['python', '-m', 'black'])
  }
};
