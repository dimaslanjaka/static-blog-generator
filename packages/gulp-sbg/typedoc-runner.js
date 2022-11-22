const { join } = require('upath');
const typedocModule = require('typedoc');
const semver = require('semver');
const { default: git } = require('git-command-helper');
const { mkdirSync, existsSync } = require('fs');
const typedocOptions = require('./typedoc');

const run = async function () {
  const outDir = join(__dirname, 'docs');
  if (!existsSync(join(outDir, '.git'))) mkdirSync(join(outDir, '.git'));
  const options = Object.assign({}, typedocOptions);

  const github = new git(outDir);
  try {
    //await github.init();
    await github.setremote('https://github.com/dimaslanjaka/docs.git');
    await github.setbranch('master');
    await github.reset('master');
  } catch {
    //
  }

  const app = new typedocModule.Application();
  if (semver.gte(typedocModule.Application.VERSION, '0.16.1')) {
    app.options.addReader(new typedocModule.TSConfigReader());
    app.options.addReader(new typedocModule.TypeDocReader());
  }
  //delete options.run;
  app.bootstrap(options);
  const project = app.convert();
  if (typeof project !== 'undefined') {
    await app.generateDocs(project, join(outDir, 'gulp-sbg'));
    await app.generateJson(project, join(outDir, 'gulp-sbg/info.json'));
  }

  try {
    const commit = await new git(__dirname).latestCommit();
    await github.addAndCommit(
      'gulp-sbg',
      `${commit} update gulp-sbg docs \nat ${new Date()}\nsource: https://github.com/dimaslanjaka/static-blog-generator-hexo/commit/${commit}`
    );
    if (await github.canPush()) await github.push();
  } catch {
    //
  }
};

if (require.main === module) {
  //console.log('called directly');
  run();
} else {
  //console.log('required as a module');
}

module.exports = run;
