require('./bin/update-cache.js');
const pjson = require('./package.json');
const { summon } = require('./preinstall.js');

(async () => {
  // @todo clear cache local packages
  const packages = Object.assign(pjson.dependencies, pjson.devDependencies);
  for (const pkgname in packages) {
    /**
     * @type {string}
     */
    const version = packages[pkgname];
    if (/^((file|github):|(git|ssh)\+|http)/.test(version)) {
      /*
      const nodeModule = join(__dirname, 'node_modules', pkgname);
      if (existsSync(nodeModule)) {
        console.log('deleting', nodeModule);
        rmSync(nodeModule, { recursive: true });
      }
      */
      await summon('npm', ['install', version], {
        cwd: __dirname,
        stdio: 'inherit'
      });
    }
  }
})();
