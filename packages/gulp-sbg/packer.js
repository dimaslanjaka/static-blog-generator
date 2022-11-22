const { spawn } = require('cross-spawn');
const { existsSync, renameSync, rmSync, mkdirpSync, writeFileSync } = require('fs-extra');
const GulpClient = require('gulp');
const { join, dirname } = require('upath');
const packagejson = require('./package.json');

const releaseDir = join(__dirname, 'release');
const child = spawn('npm', ['pack'], { cwd: __dirname, stdio: 'ignore' });
let version = (function () {
  const v = parseVersion(packagejson.version);
  return `${v.major}.${v.minor}.${v.patch}`;
})();

child.on('exit', function () {
  const filename = slugifyPkgName(`${packagejson.name}-${version}.tgz`);
  const tgz = join(__dirname, filename);
  const tgzlatest = join(releaseDir, slugifyPkgName(`${packagejson.name}.tgz`));

  console.log({ tgz, tgzlatest });

  if (!existsSync(dirname(tgzlatest))) {
    mkdirpSync(dirname(tgzlatest));
  }

  if (existsSync(tgz)) {
    GulpClient.src(tgz)
      .pipe(GulpClient.dest(releaseDir))
      .once('end', function () {
        if (existsSync(tgzlatest)) {
          rmSync(tgzlatest);
        }
        renameSync(tgz, tgzlatest);
        addReadMe();
      });
  }
});

function slugifyPkgName(str) {
  return str.replace(/\//g, '-').replace(/@/g, '');
}

/**
 * Parse Version
 * @param {string} versionString
 * @returns
 */
function parseVersion(versionString) {
  var vparts = versionString.split('.');
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

function addReadMe() {
  writeFileSync(
    join(releaseDir, 'readme.md'),
    `
  # Release Tarball
  `
  );
}
