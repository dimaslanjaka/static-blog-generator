const { readdirSync } = require('fs');
const { join } = require('path');
const pkgjson = require('./package.json');

/**
 * THEME: https://github.com/google/typedoc-neo-theme.git -> typedoc/theme
 */

/**
 * @type {import('typedoc').TypeDocOptions['entryPoints']}
 */
const entryPoints = readdirSync(join(__dirname, 'src'))
  .map((path) => './src/' + path)
  .filter((path) => /.ts$/.test(path));

//console.log(entryPoints);

/**
 * @type {import('typedoc').TypeDocOptions}
 */
const typedocOptions = {
  entryPoints,
  out: 'docs/' + pkgjson.name,
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
  readme: join(__dirname, 'readme.md'),
  tsconfig: join(__dirname, 'tsconfig.json'),
  exclude: ['*.test.ts'],
  htmlLang: 'en',
  //gitRemote: 'https://github.com/dimaslanjaka/static-blog-generator-hexo.git',
  gitRevision: 'master',
  githubPages: true,
  theme: 'hierarchy',
  plugin: [join(__dirname, 'node_modules/@youlin/typedoc-theme-hierarchy/dist/index.js')]
};
module.exports = typedocOptions;
