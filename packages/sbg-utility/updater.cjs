const pjson = require('./package.json');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const usingYarn = args.includes('-yarn') || args.includes('--yarn');

doUpdate(pjson.dependencies, 'production');

/**
 *
 * @param {Record<string,string>} packages
 * @param {'production'|'development'|'optional'} mode
 */
async function doUpdate(packages, mode) {
  const pkgnames = Object.keys(packages);
  const pkg2update = [];
  for (let i = 0; i < pkgnames.length; i++) {
    const pkgname = pkgnames[i];
    const version = packages[pkgname];
    /**
     * is remote url package
     */
    let isTarballPkg = /^(https?)|.(tgz|zip|tar|tar.gz)$|\/tarball\//i.test(version);

    /**
     * is github package
     */
    let isGitPkg = /^(git+|github:|https?:\/\/github.com\/)/i.test(version);
    /**
     * is local package
     */
    const isLocalPkg = /^(file):/i.test(version);

    /**
     * is local tarball package
     */
    const isLocalTarballpkg = isLocalPkg && /.(tgz|zip|tar|tar.gz)$/i.test(version);

    if (isLocalPkg && fs.existsSync(path.join(__dirname, 'node_modules', pkgname))) {
      fs.rmSync(path.join(__dirname, 'node_modules', pkgname), { recursive: true, force: true });
    }
    if (isLocalTarballpkg || isGitPkg || isTarballPkg || isLocalPkg) {
      /*if (!usingYarn) {
        pkg2update.push(pkgname);
      } else {
        pkg2update.push(`${pkgname}@${version}`);
      }*/
      pkg2update.push(`${pkgname}@${version}`);
    }
  }
  const pkgm = usingYarn ? 'yarn' : 'npm';
  const pkgmArg = usingYarn ? 'add' : 'i';
  let saveAs;
  switch (mode) {
    case 'development':
      if (usingYarn) {
        saveAs = '--dev';
      } else {
        saveAs = '-D';
      }
      break;

    case 'optional':
      if (usingYarn) {
        saveAs = '--optional';
      } else {
        saveAs = '-O';
      }
      break;
  }
  const argsInstall = [pkgmArg];
  if (typeof saveAs === 'string') argsInstall.push(saveAs);
  argsInstall.push(...pkg2update);
  // installing
  await new Promise((resolve) => {
    spawn(pkgm, argsInstall, { cwd: __dirname, stdio: 'inherit', shell: true }).once('exit', function () {
      resolve(null);
    });
  });
}
