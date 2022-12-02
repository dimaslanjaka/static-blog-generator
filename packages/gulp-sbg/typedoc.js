const fs = require('fs');
const path = require('upath');
const pkgjson = require('./package.json');

// required: npm i upath
// update: curl https://raw.githubusercontent.com/dimaslanjaka/static-blog-generator-hexo/master/packages/gulp-sbg/typedoc.js > typedoc.js
// repo: https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/packages/gulp-sbg/typedoc.js

/**
 * @type {import('typedoc').TypeDocOptions['entryPoints']}
 */
let entryPoints = fs.readdirSync(path.join(__dirname, 'src')).map((path) => './src/' + path);
const getFilesRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute);
    } else {
      entryPoints.push('.' + absolute.replace(path.toUnix(__dirname), ''));
    }
  }
};

getFilesRecursively(path.join(__dirname, 'src'));
// filter ts only and remove duplicates
entryPoints = entryPoints.filter((path) => /.ts$/.test(path)).filter((v, i, a) => a.indexOf(v) === i);

// console.log(entryPoints);

/**
 * @type {import('typedoc').TypeDocOptions}
 */
const typedocOptions = {
  name: 'Static Blog Generator Gulp',
  entryPoints,
  out: 'docs/' + pkgjson.name,
  entryPointStrategy: 'Expand',
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
  readme: path.join(__dirname, 'readme.md'),
  tsconfig: path.join(__dirname, 'tsconfig.json'),
  exclude: ['*.test.ts'],
  htmlLang: 'en',
  //gitRemote: 'https://github.com/dimaslanjaka/static-blog-generator-hexo.git',
  gitRevision: 'master',
  githubPages: true,
  //theme: 'hierarchy',
  plugin: ['typedoc-plugin-missing-exports'],
  ignoreCompilerErrors: true,
  logger: 'none'
};
module.exports = typedocOptions;
