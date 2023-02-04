const path = require('upath');
const glob = require('glob');
const fg = require('fast-glob');
const fs = require('fs-extra');

const bases = [path.join(__dirname, '..'), path.join(__dirname, '../packages')];
const ignore = ['**/node_modules/**/node_modules/**', '**/vendor/**', '**/scripts/**', '**/.yarn/**'];

(async function () {
  for (let i = 0; i < bases.length; i++) {
    const base = bases[i];
    const entries = await fg(['**/node_modules', '**/node_modules/**/node_modules', '**/tmp'], {
      dot: true,
      ignore
    });
    const locks = await fg(['**/yarn.lock', '**/package-lock.json'], { ignore: ['**/node_modules/**'] });
    const mapped = entries
      .concat(locks)
      .map((p) => path.join(base, p))
      .sort((x, y) => x.length - y.length)
      .reverse();
    for (let i = 0; i < mapped.length; i++) {
      const p = mapped[i];
      console.log('deleting', p.replace(base, ''));
      await fs.rm(p, { recursive: true, force: true });
    }
  }
})();
