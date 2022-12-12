const spawn = require('cross-spawn');
const { existsSync, mkdirSync } = require('fs');
const { writeFile, readFile } = require('fs/promises');
const GulpClient = require('gulp');
const { join, dirname } = require('upath');
const { run, watch } = require('./typedoc-runner');

// copy non-javascript assets from src folder
const copy = function () {
  return GulpClient.src(['**/*.*'], { cwd: join(__dirname, 'src'), ignore: ['**/*.{ts,js,json}'] }).pipe(
    GulpClient.dest(join(__dirname, 'dist'))
  );
};

/**
 * Dump Tasks from dist folder
 * @returns {Promise<string>}
 */
const dumptasks = function () {
  return new Promise((resolve) => {
    const child = spawn('gulp', ['--tasks', '--json'], { cwd: join(__dirname, 'dist') });
    /**
     * @type {string[]}
     */
    let stdout = [];

    if ('stdout' in child && typeof child.stdout === 'object') {
      child.stdout.on('data', function (data) {
        stdout.push(data.toString());
      });
    } else {
      child.on('data', (data) => stdout.push(data.toString()));
    }

    child.on('close', async () => {
      const output = stdout.map((str) => str.replace(/\[.*\]\s/gm, '').trim()).filter((str) => str.length > 0);
      output[0] = 'Gulp tasks of static-blog-generator';
      const file = join(__dirname, 'tmp/tasks.md');
      if (!existsSync(dirname(file))) mkdirSync(dirname(file));
      await writeFile(
        file,
        `
## Gulp Tasks

\`\`\`text
${output.join('\n')}
\`\`\`
    `.trim()
      );
      resolve(output);
    });
  });
};
exports.dumptasks = dumptasks;
const docs = function () {
  dumptasks().then(async function () {
    const readme = await readFile(join(__dirname, 'readme.md'), 'utf-8');
    const tasks = await readFile(join(__dirname, 'tmp/tasks.md'), 'utf-8');
    writeFile(
      join(__dirname, 'tmp/build-readme.md'),
      `
${readme}
${tasks}
`
    ).finally(typedocOptions);
  });
};

function tsc(done) {
  const child = spawn('npm', ['run', 'build'], { cwd: __dirname, stdio: 'inherit' });
  child.once('exit', () => done());
}

exports.copy = copy;
exports.docs = docs;
exports.watch = watch;
exports.tsc = tsc;
exports.default = GulpClient.series(tsc, docs);
