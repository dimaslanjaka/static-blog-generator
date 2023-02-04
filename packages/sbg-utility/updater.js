const pjson = require('./package.json');
const fs = require('fs');
const path = require('path');

doUpdate(pjson.dependencies, 'production');

/**
 *
 * @param {Record<string,string>} packages
 * @param {'production'|'development'|'optional'} mode
 */
function doUpdate(packages, mode) {
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
  }
}
