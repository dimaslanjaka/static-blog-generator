const { spawnAsync } = require('git-command-helper/dist/spawn');
const fs = require('fs-extra');

/**
 * dump list files from `npm pack`
 * @see {@link https://www.webmanajemen.com/NodeJS/snippet/get-list-files-from-npm-pack.html}
 * @param {string} cwd
 * @param {string|null|undefined} output output result to file
 */
async function checkPacked(cwd, output = null) {
  const result = await spawnAsync('npm', ['pack', '--json', '--dry-run'], { cwd });
  const parse = JSON.parse(result.stdout)[0];
  const { files } = parse;
  // uncomment for log to file
  //const output = join(__dirname, 'tmp/listpack.txt');
  if (output) {
    fs.writeFileSync(output, files.map((o) => o && o.path).join('\n'));
    console.log(output);
  } else {
    console.log(files);
  }
}

module.exports = { checkPacked };
