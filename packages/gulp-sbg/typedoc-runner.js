const { join } = require('upath');
const typedocModule = require('typedoc');
const semver = require('semver');
const { default: git } = require('git-command-helper');
const { mkdirSync, existsSync } = require('fs');
const typedocOptions = require('./typedoc');
const gulp = require('gulp');
const pkgjson = require('./package.json');

// required: npm i upath
// required: npm i -D semver typedoc git-command-helper gulp
// update: curl https://raw.githubusercontent.com/dimaslanjaka/static-blog-generator-hexo/master/packages/gulp-sbg/typedoc-runner.js > typedoc-runner.js
// repo: https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/packages/gulp-sbg/typedoc-runner.js

/**
 * Compile typedocs
 */
const compile = async function () {
  const outDir = join(__dirname, 'docs');
  const projectDocsDir = join(outDir, pkgjson.name);
  if (!existsSync(projectDocsDir)) mkdirSync(projectDocsDir, { recursive: true });
  if (!existsSync(join(outDir, '.git'))) mkdirSync(join(outDir, '.git'), { recursive: true });
  const options = Object.assign({}, typedocOptions);

  const app = new typedocModule.Application();
  if (semver.gte(typedocModule.Application.VERSION, '0.16.1')) {
    app.options.addReader(new typedocModule.TSConfigReader());
    app.options.addReader(new typedocModule.TypeDocReader());
  }
  //delete options.run;
  app.bootstrap(options);
  const project = app.convert();
  if (typeof project !== 'undefined') {
    await app.generateDocs(project, projectDocsDir);
    await app.generateJson(project, join(projectDocsDir, 'info.json'));
  }
};

/**
 * Compile and publish to github pages
 */
const publish = async function () {
  const outDir = join(__dirname, 'docs');
  if (!existsSync(join(outDir, '.git'))) mkdirSync(join(outDir, '.git'), { recursive: true });

  const github = new git(outDir);
  try {
    //await github.init();
    await github.setremote('https://github.com/dimaslanjaka/docs.git');
    await github.setbranch('master');
    await github.reset('master');
  } catch {
    //
  }

  await compile();

  try {
    const commit = await new git(__dirname).latestCommit();
    const remote = (await new git(__dirname).getremote()).push.url.replace(/.git$/, '').trim();
    await github.addAndCommit(
      'gulp-sbg',
      `${commit} update ${pkgjson.name} docs \nat ${new Date()}\nsource: ${remote}/commit/${commit}`
    );
    if (await github.canPush()) await github.push();
  } catch {
    //
  }
};

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
    console.log('[compile] start');
    await compile();
    console.log('[compile] finish');
  })();
} else {
  //console.log('required as a module');
}

module.exports = publish;
module.exports = { run: publish, watch, compile };
