const { join } = require('upath');
const typedocModule = require('typedoc');
const semver = require('semver');
const { default: git } = require('git-command-helper');
const { mkdirSync, existsSync, writeFileSync, readdirSync, statSync } = require('fs');
const typedocOptions = require('./typedoc');
const gulp = require('gulp');
const pkgjson = require('./package.json');
const { EOL } = require('os');
const axios = require('axios');
const { writeFile } = require('fs/promises');

/**
 * @type {import('git-command-helper/dist/spawn').spawnAsync}
 */
const spawnAsync =
  pkgjson.name === 'git-command-helper' ? require('./dist').spawnAsync : require('git-command-helper').spawnAsync;

// required : npm i upath && npm i -D semver typedoc git-command-helper gulp cross-spawn
// update   : curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/typedoc-runner.js > typedoc-runner.js
// repo     : https://github.com/dimaslanjaka/nodejs-package-types/blob/main/typedoc-runner.js
// usages
// - git clone https://github.com/dimaslanjaka/docs.git
// - node typedoc-runner.js

const REPO_URL = 'https://github.com/dimaslanjaka/docs.git';

let compiled = 0;

/**
 * Compile typedocs
 * @param {import('typedoc').TypeDocOptions} options
 * @param {(...args: any[]) => any} callback
 */
const compile = async function (options = {}, callback = null) {
  const outDir = join(__dirname, 'docs');
  const projectDocsDir = join(outDir, pkgjson.name);

  if (!existsSync(outDir)) {
    await spawnAsync('git', ['clone', REPO_URL, 'docs'], { cwd: __dirname });
  }

  if (!existsSync(projectDocsDir)) mkdirSync(projectDocsDir, { recursive: true });
  options = Object.assign(getTypedocOptions(), options || {});

  // disable delete dir while running twice
  if (compiled > 0) options.cleanOutputDir = false;
  compiled++;

  const app = new typedocModule.Application();
  if (semver.gte(typedocModule.Application.VERSION, '0.16.1')) {
    app.options.addReader(new typedocModule.TSConfigReader());
    app.options.addReader(new typedocModule.TypeDocReader());
  }

  //console.log(options);
  //delete options.run;

  app.bootstrap(options);
  const project = app.convert();
  if (typeof project !== 'undefined') {
    await app.generateDocs(project, projectDocsDir);
    await app.generateJson(project, join(projectDocsDir, 'info.json'));
  } else {
    console.error('[error]', 'project undefined');
  }

  // call API callback
  if (typeof callback === 'function') await callback.apply(app);
  // call standalone callback
  const callback_script = join(__dirname, 'typedoc-callback.js');
  if (existsSync(callback_script)) {
    await spawnAsync('node', [callback_script], { cwd: __dirname, stdio: 'inherit' });
  }
  // generate readme.md and index.html
  await createIndex();
};

/**
 * Compile and publish to github pages
 * @param {import('typedoc').TypeDocOptions} options
 * @param {(...args: any[]) => any} callback
 */
const publish = async function (options = {}, callback = null) {
  const outDir = join(__dirname, 'docs');

  const github = new git(outDir);

  try {
    if (!existsSync(join(outDir, '.git'))) {
      mkdirSync(join(outDir, '.git'), { recursive: true });
      await github.init();
    }
    await github.setremote(REPO_URL);
    await github.setbranch('master');
    await github.spawn('git', 'config core.eol lf'.split(' '));
    await github.pull(['--recurse-submodule', '-X', 'theirs']);
  } catch {
    //
  }

  for (let i = 0; i < 2; i++) {
    await compile(options, callback);
  }

  const response = await axios.default.get(
    'https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/main/.gitattributes',
    {
      responseType: 'blob'
    }
  );
  writeFile(join(outDir, '.gitattributes'), response.data, (err) => {
    if (err) throw err;
    console.log('.gitattributes has been saved!');
  });

  try {
    const commit = await new git(__dirname).latestCommit();
    const remote = (await new git(__dirname).getremote()).push.url.replace(/.git$/, '').trim();
    if (remote.length > 0) {
      console.log('project', remote);
      console.log('commit', `${remote}/commit/${commit}`);
      await github.add(pkgjson.name);
      await spawnAsync('git', [
        'commit',
        '-m',
        `update ${pkgjson.name} docs [${remote}/commit/${commit}]`,
        '-m',
        `at ${new Date()}`
      ]);
      const isCanPush = await github.canPush();
      if (isCanPush) {
        await github.push();
      }
    }
  } catch {
    //
  }
};

let opt = typedocOptions;
/**
 * Get typedoc options
 * @returns {typeof import('./typedoc')}
 */
function getTypedocOptions() {
  return opt;
}

/**
 * Set typedoc options
 * @param {typeof import('./typedoc')} newOpt
 */
function setTypedocOptions(newOpt) {
  opt = Object.assign(opt, newOpt || {});
  return opt;
}

/**
 * Watch sources
 * @param {gulp.TaskFunctionCallback} done
 */
const watch = function (done) {
  const watcher = gulp.watch([join(__dirname, 'src/**/*')]);
  watcher.on('change', function (_event, filename) {
    console.log(filename);
  });
  watcher.on('close', done);
};

if (require.main === module) {
  (async () => {
    const argv = process.argv;
    // node typedoc-runner.js --publish
    if (argv.includes('--publish')) {
      console.log('[publish] start');
      await publish();
      console.log('[publish] finish');
    } else {
      console.log('[compile] start');
      await compile();
      console.log('[compile] finish');
    }
  })();
} else {
  //console.log('required as a module');
}

/**
 * create docs/readme.md
 */
async function createIndex() {
  let body =
    `
<h1 id="headline">Monorepo Documentation Site</h1>
  `.trim() + EOL;

  readdirSync(join(__dirname, 'docs')).forEach((filename) => {
    const path = join(__dirname, 'docs', filename);
    const stat = statSync(path);

    if (stat.isDirectory() && filename !== '.git') {
      body +=
        `
<li><a href="./${filename}">${filename}</a></li>
      `.trim() + EOL;
    }
  });

  writeFileSync(join(__dirname, 'docs/index.html'), body.trim());
}

module.exports = {
  watch,
  compile,
  compileDocs: compile,
  publish,
  getTypedocOptions,
  setTypedocOptions
};
