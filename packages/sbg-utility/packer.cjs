/* eslint-disable no-useless-escape */
const { spawn } = require('cross-spawn');
const fs = require('fs-extra');
const { join, dirname, toUnix } = require('upath');
const packagejson = require('./package.json');
const crypto = require('crypto');

// const os = require('os');

// auto create tarball (tgz) on release folder
// requred        : npm i -D https://github.com/dimaslanjaka/node-cross-spawn/tarball/private upath fs-extra
// raw            : https://github.com/dimaslanjaka/nodejs-package-types/raw/main/packer.js
// github         : https://github.com/dimaslanjaka/nodejs-package-types/blob/main/packer.js
// update         : curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/packer.js > packer.js
// usage          : node packer.js
// github actions : https://github.com/dimaslanjaka/nodejs-package-types/blob/main/.github/workflows/build-release.yml

//// CHECK REQUIRED PACKAGES

const scriptname = `[packer]`;
const isAllPackagesInstalled = ['cross-spawn', 'ansi-colors', 'glob', 'upath', 'minimist'].map((name) => ({
  name,
  installed: isPackageInstalled(name)
}));
if (!isAllPackagesInstalled.every((o) => o.installed === true)) {
  const names = isAllPackagesInstalled.filter((o) => o.installed === false).map((o) => o.name);
  console.log(scriptname, 'package', names.join(', '), 'is not installed', 'skipping postinstall script');
  process.exit(0);
}

const args = process.argv.slice(2);
const argv = require('minimist')(args);

const verbose = args.includes('-d') || args.includes('--verbose');
let log = console.log;
if (!verbose) {
  log = (..._args) => {
    //
  };
}

const withYarn = args.includes('-yarn') || args.includes('--yarn');
const withFilename = argv['fn'] || argv['filename'] ? true : false;
const releaseDir1 = join(__dirname, 'release');
const releaseDir2 = join(__dirname, 'releases');
const releaseDir = !fs.existsSync(releaseDir2) ? releaseDir1 : releaseDir2;

// create released directory when not exist
if (!fs.existsSync(releaseDir)) {
  fs.mkdirpSync(releaseDir);
}

log('='.repeat(19));
log('= packing started =');
log('='.repeat(19));

/**
 * is current device is Github Actions
 */
const _isCI = process.env.GITHUB_ACTION && process.env.GITHUB_ACTIONS;

const child = !withYarn
  ? spawn('npm', ['pack'], { cwd: __dirname, stdio: 'ignore' })
  : spawn('yarn', ['pack'], { cwd: __dirname, stdio: 'ignore' });

const version = (function () {
  const v = parseVersion(packagejson.version);
  return `${v.major}.${v.minor}.${v.patch}`;
})();

child.on('exit', withYarn ? bundleWithYarn : bundleWithNpm);

const getPackageHashes = async function () {
  let hashes = {};
  const metafile = join(releaseDir, 'metadata.json');
  // read old meta
  if (fs.existsSync(metafile)) {
    try {
      hashes = Object.assign(hashes, JSON.parse(fs.readFileSync(metafile, 'utf-8')));
    } catch {
      hashes = {};
    }
  }
  const pkglock = [join(__dirname, 'package-lock.json'), join(__dirname, 'yarn.lock')].filter((str) =>
    fs.existsSync(str)
  )[0];
  const readDir = fs
    .readdirSync(releaseDir)
    .filter((path) => path.endsWith('tgz'))
    .map((path) => join(releaseDir, path));

  if (typeof pkglock === 'string' && fs.existsSync(pkglock)) {
    readDir.push(pkglock);
  }
  for (let i = 0; i < readDir.length; i++) {
    const file = readDir[i];
    const stat = fs.statSync(file);
    const size = `${parseFloat(stat.size / Math.pow(1024, 1)).toFixed(2)} KB`;
    // assign to existing object
    hashes = Object.assign({}, hashes, {
      [toUnix(file).replace(toUnix(__dirname), '')]: {
        integrity: {
          sha1: await file_to_hash('sha1', file),
          sha256: await file_to_hash('sha256', file, 'base64'),
          md5: await file_to_hash('md5', file),
          sha512: await file_to_hash('sha512', file, 'base64')
        },
        size
      }
    });
    //log("Last callback call at index " + index + " with value " + file);

    //hashes = { [os.type()]: { [os.arch()]: hashes } };
    fs.writeFileSync(metafile, JSON.stringify(hashes, null, 2));
    log(hashes);
  }
};

function bundleWithYarn() {
  // start bundle
  let filename = 'package.tgz';
  let tgz = join(__dirname, filename);
  const targetFname =
    argv['fn'] || argv['filename'] || slugifyPkgName(`${packagejson.name}-${packagejson.version}.tgz`);
  if (!fs.existsSync(tgz)) {
    filename = slugifyPkgName(`${packagejson.name}-v${packagejson.version}.tgz`);
    tgz = join(__dirname, filename);
  }

  if (withFilename) {
    const tgzlatest = join(releaseDir, targetFname + '.tgz');
    if (fs.existsSync(tgz)) {
      fs.copySync(tgz, tgzlatest, { overwrite: true });
    }
  } else {
    const tgzlatest = join(releaseDir, slugifyPkgName(`${packagejson.name}.tgz`));
    const tgzversion = join(releaseDir, targetFname);

    if (fs.existsSync(tgz)) {
      fs.copySync(tgz, tgzlatest, { overwrite: true });
      fs.copySync(tgz, tgzversion, { overwrite: true });
    }
  }

  if (fs.existsSync(tgz)) {
    // remove package.tgz
    fs.rmSync(tgz, { recursive: true, force: true });
  }

  // write hashes info
  getPackageHashes().then(() => {
    log('='.repeat(20));
    log('= packing finished =');
    log('='.repeat(20));
  });
}

function bundleWithNpm() {
  const filename = slugifyPkgName(`${packagejson.name}-${version}.tgz`);
  const tgz = join(__dirname, filename);
  const tgzversion = join(releaseDir, filename);

  if (!fs.existsSync(tgz)) {
    const filename2 = slugifyPkgName(`${packagejson.name}-${packagejson.version}.tgz`);
    const origintgz = join(__dirname, filename2);
    fs.renameSync(origintgz, tgz);
  }
  const tgzlatest = join(releaseDir, slugifyPkgName(`${packagejson.name}.tgz`));

  // create dir when not exist
  if (!fs.existsSync(dirname(tgzlatest))) {
    fs.mkdirpSync(dirname(tgzlatest));
  }

  if (fs.existsSync(tgz)) {
    fs.copySync(tgz, tgzlatest);
    fs.copySync(tgz, tgzversion);
    if (fs.existsSync(tgz)) fs.rmSync(tgz);

    // write hashes info
    getPackageHashes().then(() => {
      log('='.repeat(20));
      log('= packing finished =');
      log('='.repeat(20));
    });
  }
}

function slugifyPkgName(str) {
  return str.replace(/\//g, '-').replace(/@/g, '');
}

/**
 * Parse Version
 * @param {string} versionString
 * @returns
 */
function parseVersion(versionString) {
  const vparts = versionString.split('.');
  const version = {
    major: parseInt(vparts[0]),
    minor: parseInt(vparts[1]),
    patch: parseInt(vparts[2].split('-')[0]),
    build: parseInt(vparts[3] || null),
    range: parseInt(vparts[2].split('-')[1]),
    commit: vparts[2].split('-')[2]
  };

  return version;
}

/**
 * convert file to hash
 * @param {'sha1' | 'sha256' | 'sha384' | 'sha512', 'md5'} alogarithm
 * @param {string} path
 * @param {import('crypto').BinaryToTextEncoding} encoding
 * @returns
 */
function file_to_hash(alogarithm = 'sha1', path, encoding = 'hex') {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(alogarithm);
    const rs = fs.createReadStream(path);
    rs.on('error', reject);
    rs.on('data', (chunk) => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest(encoding)));
  });
}

/**
 * check package installed
 * @param {string} packageName
 * @returns
 */
function isPackageInstalled(packageName) {
  try {
    const modules = Array.from(process.moduleLoadList).filter((str) => !str.startsWith('NativeModule internal/'));
    return modules.indexOf(`NativeModule ${packageName}`) >= 0 || fs.existsSync(require.resolve(packageName));
  } catch (e) {
    return false;
  }
}
