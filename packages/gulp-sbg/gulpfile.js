const GulpClient = require('gulp');
const { join } = require('upath');
const typedocModule = require('typedoc');
const semver = require('semver');
const typedocOptions = require('./typedoc');
const { default: git } = require('git-command-helper');
const { mkdirSync, existsSync } = require('fs');

// copy non-javascript assets from src folder
const copy = function () {
  return GulpClient.src(['**/*.*'], { cwd: join(__dirname, 'src'), ignore: ['**/*.{ts,js,json}'] }).pipe(
    GulpClient.dest(join(__dirname, 'dist'))
  );
};

const docs = async function () {
  const outDir = join(__dirname, 'docs');
  if (!existsSync(join(outDir, '.git'))) mkdirSync(join(outDir, '.git'));

  const github = new git(outDir);
  try {
    //await github.init();
    await github.setremote('https://github.com/dimaslanjaka/docs.git').catch(noop);
    await github.setbranch('master').catch(noop);
    await github.reset('master').catch(noop);
  } catch {
    //
  }

  const app = new typedocModule.Application();
  if (semver.gte(typedocModule.Application.VERSION, '0.16.1')) {
    app.options.addReader(new typedocModule.TSConfigReader());
    app.options.addReader(new typedocModule.TypeDocReader());
  }
  app.bootstrap(typedocOptions);
  const project = app.convert();
  if (typeof project !== 'undefined') {
    await app.generateDocs(project, join(outDir, 'gulp-sbg'));
    await app.generateJson(project, join(outDir, 'gulp-sbg/info.json'));
  }

  try {
    await github.addAndCommit('gulp-sbg', 'update gulp-sbg docs\nat ' + new Date()).catch(noop);
    await github.push().catch(noop);
  } catch {
    //
  }
};

exports.copy = copy;
exports.docs = docs;
exports.default = GulpClient.series(copy, docs);

function noop() {
  //
}
