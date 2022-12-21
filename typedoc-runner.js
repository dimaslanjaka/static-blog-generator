const { join } = require('upath');
const typedocModule = require('typedoc');
const semver = require('semver');
const { default: git } = require('git-command-helper');
const { mkdirSync, existsSync, writeFileSync, readdirSync, statSync } = require('fs');
const typedocOptions = require('./typedoc');
const gulp = require('gulp');
const pkgjson = require('./package.json');
const spawn = require('cross-spawn');
const { EOL } = require('os');

// required : npm i upath && npm i -D semver typedoc git-command-helper gulp cross-spawn
// update   : curl -L https://github.com/dimaslanjaka/static-blog-generator/raw/master/typedoc-runner.js > typedoc-runner.js
// repo     : https://github.com/dimaslanjaka/static-blog-generator/blob/master/typedoc-runner.js

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
    spawn('git', ['clone', REPO_URL, 'docs'], { cwd: __dirname });
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

  if (typeof callback === 'function') await callback.apply(app);
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
    //await github.reset('master');
    await github.pull(['--recurse-submodule', '-X', 'theirs']);
    await github.spawn('git', 'config core.eol lf'.split(' '));
  } catch {
    //
  }

  for (let i = 0; i < 2; i++) {
    await compile(options, callback);
  }

  writeFileSync(
    join(outDir, '.gitattributes'),
    `
*           text=auto
*.txt       text eol=lf
*.json      text eol=lf
*.txt       text
*.vcproj    text eol=crlf
*.sh        text eol=lf
*.ts        text eol=lf
*.js        text eol=lf
*.png       binary diff
*.jpg       binary diff
*.ico       binary diff
*.pdf       binary diff
`.trim()
  );

  try {
    const commit = await new git(__dirname).latestCommit().catch(noop);
    const remote = (await new git(__dirname).getremote().catch(noop)).push.url.replace(/.git$/, '').trim();
    if (remote.length > 0) {
      console.log('current git project', remote);
      await github.add(pkgjson.name).catch(noop);
      await github
        .commit(`update ${pkgjson.name} docs [${commit}] \nat ${new Date()}\nsource: ${remote}/commit/${commit}`)
        .catch(noop);
      const isCanPush = await github.canPush().catch(noop);
      if (isCanPush) {
        await github.push().catch(noop);
      }
    }
  } catch {
    //
  }
};

function noop(..._) {
  return;
}

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
# Monorepo Documentation Site
  `.trim() + EOL;

  readdirSync(join(__dirname, 'docs')).forEach((filename) => {
    const path = join(__dirname, 'docs', filename);
    const stat = statSync(path);

    if (stat.isDirectory() && filename !== '.git') {
      body +=
        `
- [${filename}](./${filename})
      `.trim() + EOL;
    }
  });

  writeFileSync(join(__dirname, 'docs/readme.md'), body.trim());
}

module.exports = {
  watch,
  compile,
  publish,
  getTypedocOptions,
  setTypedocOptions
};
