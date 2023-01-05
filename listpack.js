const { writeFileSync } = require('fs');
const { spawnAsync } = require('git-command-helper/dist/spawn');
const { EOL } = require('os');
const { join } = require('path');

spawnAsync('npm', ['pack', '--json', '--dry-run']).then((result) => {
  const parse = JSON.parse(result.stdout)[0];
  const { files } = parse;
  const output = join(__dirname, 'tmp/listpack.txt');
  writeFileSync(output, files.map((o) => o && o.path).join(EOL));
  console.log(output);
});
