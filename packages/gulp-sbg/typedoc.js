const fs = require('fs');
const path = require('upath');
const pkgjson = require('./package.json');

// required: npm i upath
// required: npm i -D typedoc typedoc-plugin-missing-exports
// update: curl https://raw.githubusercontent.com/dimaslanjaka/static-blog-generator-hexo/master/packages/gulp-sbg/typedoc.js > typedoc.js
// repo: https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/packages/gulp-sbg/typedoc.js

/**
 * @type {import('typedoc').TypeDocOptions['entryPoints']}
 */
let entryPoints = fs
  .readdirSync(path.join(__dirname, 'src'))
  .map((path) => './src/' + path);
const getFilesRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute);
    } else {
      entryPoints.push('.' + absolute.replace(path.toUnix(__dirname), ''));
      // unique
      entryPoints = entryPoints.filter(function (x, i, a) {
        return a.indexOf(x) === i;
      });
    }
  }
};

getFilesRecursively(path.join(__dirname, 'src'));
// filter ts only and remove duplicates
entryPoints = entryPoints
  .filter((path) => /.ts$/.test(path))
  .filter((v, i, a) => a.indexOf(v) === i);

// console.log(entryPoints);

/**
 * Build Readme
 */
const readme = [
  path.join(__dirname, 'readme.md'),
  path.join(__dirname, 'README.md')
].filter((str) => fs.existsSync(str))[0];
if (typeof readme === 'string') {
  if (fs.existsSync(readme)) {
    let content = fs.readFileSync(readme, 'utf-8');

    // add changelog if exist
    const changelog = [
      path.join(__dirname, 'changelog.md'),
      path.join(__dirname, 'CHANGELOG.md')
    ].filter((str) => fs.existsSync(str))[0];
    if (typeof changelog === 'string') {
      content += '\n\n' + fs.readFileSync(changelog, 'utf-8');
    }

    const tmp = path.join(__dirname, 'tmp');
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);
    fs.writeFileSync(path.join(tmp, 'readme.md'), content);
  }
}

/**
 * TypeDoc options (see TypeDoc docs http://typedoc.org/api/interfaces/typedocoptionmap.html)
 * @type {import('typedoc').TypeDocOptions}
 */
const typedocOptions = {
  name: pkgjson.projectName || 'Static Blog Generator Gulp',
  //entryPoints: pkgjson.main.replace('dist', 'src'),
  entryPoints,
  // Output options (see TypeDoc docs http://typedoc.org/api/interfaces/typedocoptionmap.html)
  // NOTE: the out option and the json option cannot share the same directory
  out: './docs/' + pkgjson.name,
  json: './docs/' + pkgjson.name + '/info.json',
  entryPointStrategy: 'expand',
  gaID: 'UA-106238155-1',
  commentStyle: 'all',
  hideGenerator: true,
  searchInComments: true,
  cleanOutputDir: true,
  navigationLinks: {
    Homepage: 'https://www.webmanajemen.com',
    GitHub: 'https://github.com/dimaslanjaka'
  },
  inlineTags: ['@link'],
  readme: './tmp/readme.md',
  tsconfig: fs.existsSync(path.join(__dirname, 'tsconfig.build.json'))
    ? './tsconfig.build.json'
    : fs.existsSync(path.join(__dirname, 'tsconfig-build.json'))
    ? './tsconfig-build.json'
    : './tsconfig.json',
  //includes: ['src'],
  exclude: ['*.test.ts', '*.test.js'],
  htmlLang: 'en',
  //gitRemote: 'https://github.com/dimaslanjaka/static-blog-generator-hexo.git',
  gitRevision: 'master',
  githubPages: true,
  //theme: 'hierarchy',
  plugin: ['typedoc-plugin-missing-exports'],
  ignoreCompilerErrors: true,
  logger: 'none'
  //version: true,
  //includeVersion: true
};

const cjson = path.join(__dirname, 'typedoc.json');
const scriptName = path.basename(__filename);

// run json creation when filename endswith -config.js
if (scriptName.endsWith('-config.js')) {
  typedocOptions['$schema'] = 'https://typedoc.org/schema.json';
  fs.writeFileSync(cjson, JSON.stringify(typedocOptions, null, 2));
} else {
  if (fs.existsSync(cjson)) fs.rm(cjson);
}

module.exports = typedocOptions;
