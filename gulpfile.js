const spawn = require('cross-spawn');
const { existsSync, mkdirSync } = require('fs');
const { writeFile, readFile } = require('fs/promises');
const GulpClient = require('gulp');
const { EOL } = require('os');
const { join, dirname, toUnix } = require('upath');
const { setTypedocOptions, getTypedocOptions, publish } = require('./typedoc-runner');

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
${output.join(EOL)}
\`\`\`

## Coverage
> [Coverage Here](./coverage)
    `.trim()
      );
      resolve(output);
    });
  });
};

exports.dumptasks = dumptasks;

/**
 * Copy coverage/lcov-report to docs/static-blog-generator/coverage
 * @returns
 */
const coverage = function () {
  return new Promise((resolve) => {
    const coverageDir = join(__dirname, 'coverage/lcov-report');
    if (existsSync(coverageDir)) {
      console.log('copying coverage', coverageDir.replace(toUnix(__dirname), ''));
      GulpClient.src(['*.*', '**/*.*'], { cwd: coverageDir })
        .pipe(GulpClient.dest(join(__dirname, 'docs/static-blog-generator/coverage')))
        .once('end', () => resolve(null));
    } else {
      resolve(null);
    }
  });
};

exports.coverage = coverage;

const docs = async function () {
  await dumptasks();
  const readme = await readFile(join(__dirname, 'readme.md'), 'utf-8');
  const tasks = await readFile(join(__dirname, 'tmp/tasks.md'), 'utf-8');
  await writeFile(
    join(__dirname, 'tmp/build-readme.md'),
    `
${readme}
${tasks}

## CHANGELOG
> all changelog at https://github.com/dimaslanjaka/static-blog-generator/commits/master
`.trim()
  );
  const opt = setTypedocOptions(Object.assign(getTypedocOptions(), { readme: './tmp/build-readme.md' }));
  await publish(opt, coverage);
};

function tsc(done) {
  const child = spawn('npm', ['run', 'build'], { cwd: __dirname, stdio: 'inherit' });
  child.once('exit', () => done());
}

exports.copy = copy;
exports.docs = docs;
exports.tsc = tsc;
exports.default = GulpClient.series(tsc, docs);

async function buildWatch(done) {
  const build = async function () {
    const child = spawn('npm', ['run', 'build'], { cwd: __dirname });

    let data = '';
    for await (const chunk of child.stdout) {
      console.log('stdout chunk:');
      console.log(String(chunk));
      data += chunk;
    }
    let error = '';
    for await (const chunk of child.stderr) {
      console.error('stderr chunk:');
      console.log(String(chunk));
      error += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
      child.on('close', resolve);
      child.on('error', reject);
    });

    if (exitCode) {
      throw new Error(`subprocess error exit ${exitCode}, ${error}`);
    }
    return data;
  };
  await build();
  const watcher = GulpClient.watch('src/**/*.*', { ignored: ['**/*.json'], cwd: __dirname });
  watcher.on('close', done);
  watcher.on('change', build);
  watcher.on('error', done);
  return watcher;
}
exports.watch = buildWatch;
