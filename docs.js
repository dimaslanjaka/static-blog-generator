const spawn = require('cross-spawn');
const { existsSync, mkdirSync } = require('fs');
const { writeFile, readFile } = require('fs/promises');
const gulp = require('gulp');
const { EOL } = require('os');
const { join, dirname, toUnix } = require('upath');
const { setTypedocOptions, publish } = require('./typedoc-runner');

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

/**
 * Copy coverage/lcov-report to docs/static-blog-generator/coverage
 * @returns
 */
const coverage = function () {
  return new Promise((resolve) => {
    const coverageDir = join(__dirname, 'coverage/lcov-report');
    if (existsSync(coverageDir)) {
      console.log('copying coverage', coverageDir.replace(toUnix(__dirname), ''));
      gulp
        .src(['*.*', '**/*.*'], { cwd: coverageDir })
        .pipe(gulp.dest(join(__dirname, 'docs/static-blog-generator/coverage')))
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
  const opt = setTypedocOptions({ readme: './tmp/build-readme.md', cleanOutputDir: false });
  await publish(opt, coverage);
};

docs();
