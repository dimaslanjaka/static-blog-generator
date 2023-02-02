const spawnAsync = require('@expo/spawn-async');
const glob = require('glob');
const path = require('upath');
const base = path.join(__dirname, '..');
const fs = require('fs-extra');
const axios = require('axios');
const utility = require('sbg-utility');
const compressing = require('compressing');
const root = require('../package.json');
const mv = require('mv');

const rootpkg = Object.assign({}, root.dependencies || {}, root.devDependencies || {}, root.optionalDependencies || {});

const packages = glob
  .sync('**/package.json', {
    ignore: ['**/node_modules/**', '**/dist/**', '**/tmp/**', '**/scripts/**', '**/bin/**', '**/test/**'],
    cwd: base
  })
  .map((p) => path.join(base, p))
  .reverse();

const parse = packages
  .map((p) => {
    return {
      base: path.dirname(p),
      path: p,
      parse: JSON.parse(fs.readFileSync(p, 'utf-8'))
    };
  })
  .map(({ path, base, parse }) => {
    return {
      base,
      path,
      parse,
      deps: Object.assign({}, parse.dependencies || {}, parse.devDependencies || {}, parse.optionalDependencies || {})
    };
  });

(async function () {
  for (let i = 0; i < parse.length; i++) {
    const pkg = parse[i];
    const { deps, base } = pkg;
    for (const pkgname in deps) {
      if (Object.hasOwnProperty.call(deps, pkgname) && !rootpkg[pkgname]) {
        const version = deps[pkgname];
        if (!/^(https?:\/\/|file\:|git\+|ssh)/i.test(version)) {
          const npmview = await spawnAsync('npm', ['view', pkgname, 'dist.tarball']).catch((e) => e.message);
          if (typeof npmview === 'object' && 'output' in npmview) {
            const saveto = path.join(__dirname, 'tmp/tgz', `${pkgname}-${version.replace(/[^a-zA-Z0-9\.]/g, '')}.tgz`);
            const url = npmview.output[0].trim();
            const dest_node_modules = path.join(base, 'node_modules', pkgname);
            const extractto = path.join(__dirname, 'tmp/extract', pkgname);
            // skip download and extract when already installed
            if (fs.existsSync(dest_node_modules)) continue;

            // download the tarball
            await download(url, saveto);
            // extract tarball to tmp
            await extract(saveto, extractto);
            const pathpkg = path.join(extractto, 'package');
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                /*if (fs.existsSync(dest_node_modules)) {
                  fs.rmSync(dest_node_modules, { recursive: true });
                }*/
                mv(pathpkg, dest_node_modules, function (err) {
                  // fs.rmSync(pathpkg, { recursive: true, force: true });
                  if (err) return reject(err);
                  // deleting extract folders
                  fs.rmSync(extractto, { recursive: true, force: true });
                  resolve(null);
                });
              }, 3000);
            });
            console.log(pkgname, version, 'extracted');
            // await spawnAsync('npm', ['install'], { cwd: dest_node_modules });
            // console.log(pkgname, version, 'installed', dest_node_modules);
          }
        }
      }
    }
  }
})();

async function download(url, dest) {
  const response = await axios.default.get(url, {
    responseType: 'arraybuffer', // Important
    headers: {
      'Content-Type': 'application/gzip'
    }
  });
  if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, response.data, { encoding: 'binary' });
}

async function extract(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  await compressing.tgz.uncompress(from, to);
}
