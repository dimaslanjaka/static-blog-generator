import path from 'upath';

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

function toCmd(cwd, command, files) {
  const baseDir = cwd === 'root' ? '.' : cwd;
  const escaped = files
    .map((file) => path.toUnix(path.resolve(baseDir, file)))
    .map((file) => `"${file}"`)
    .join(' ');

  return `${command} ${escaped}`;
}

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '**/*.{js,cjs,mjs,ts,jsx,tsx}': (files) => {
    const groups = groupByPackage(files);

    return Object.entries(groups).map(([cwd, fs]) => {
      const dir = cwd === 'root' ? '.' : cwd;
      return toCmd(dir, 'eslint --fix', fs);
    });
  },

  '**/*.{json,css,scss,less,yml,yaml,sql}': (files) => {
    const groups = groupByPackage(files);

    return Object.entries(groups).map(([cwd, fs]) => {
      const dir = cwd === 'root' ? '.' : cwd;
      return toCmd(dir, 'prettier --write', fs);
    });
  },

  '**/*.php': (files) => {
    const groups = groupByPackage(files);

    return Object.entries(groups).map(([cwd, fs]) => {
      const dir = cwd === 'root' ? '.' : cwd;
      return toCmd(dir, 'composer exec php-cs-fixer fix', fs);
    });
  },

  '**/*.py': (files) => {
    const groups = groupByPackage(files);

    return Object.entries(groups).map(([cwd, fs]) => {
      const dir = cwd === 'root' ? '.' : cwd;
      return toCmd(dir, 'python -m black', fs);
    });
  }
};
