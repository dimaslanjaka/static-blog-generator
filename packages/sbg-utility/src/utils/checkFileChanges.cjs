const fs = require('fs-extra');
const path = require('upath');
const crypto = require('crypto');
const { glob } = require('glob');

/**
 * Generate hash from file contents
 * @param {string[]} files
 * @returns {string}
 */
function generateHash(files) {
  const hash = crypto.createHash('sha1');

  for (const file of files.sort()) {
    if (!fs.existsSync(file)) continue;

    hash.update(file);

    try {
      hash.update(fs.readFileSync(file));
    } catch (_) {
      // ignore unreadable file
    }
  }

  return hash.digest('hex');
}

/**
 * Resolve file patterns into unique file list
 * @param {string[]} patterns
 * @returns {string[]}
 */
function resolveFiles(patterns) {
  const files = new Set();

  for (const pattern of patterns) {
    for (const file of glob.sync(pattern, {
      nodir: true,
      absolute: true
    })) {
      files.add(path.normalizeSafe(file));
    }
  }

  return [...files];
}

/**
 * Check file changes using content hash cache
 *
 * @param {Object} options
 * @param {string[]} options.patterns
 * @param {string} [options.cacheFile]
 * @param {(files: string[]) => any|Promise<any>} options.callback
 * @returns {Promise<boolean>}
 */
async function checkFileChanges({ patterns, cacheFile = 'tmp/file-change-cache', callback }) {
  if (!Array.isArray(patterns) || patterns.length === 0) {
    throw new TypeError('patterns must be non-empty array');
  }

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be function');
  }

  const files = resolveFiles(patterns);
  const currentHash = generateHash(files);

  let oldHash = null;

  if (await fs.pathExists(cacheFile)) {
    oldHash = (await fs.readFile(cacheFile, 'utf8')).trim();
  }

  // no changes
  if (oldHash === currentHash) {
    return false;
  }

  // callback must succeed first
  await callback(files);

  // only save cache if callback success
  await fs.ensureDir(path.dirname(cacheFile));
  await fs.writeFile(cacheFile, currentHash, 'utf8');

  return true;
}

module.exports = {
  checkFileChanges
};
module.exports.default = module.exports;
