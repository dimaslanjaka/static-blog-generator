const { readdirSync } = require('fs');
const { join } = require('path/posix');

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
module.exports = {
  entryPoints,
  out: 'docs/gulp-sbg',
  gaID: 'UA-106238155-1',
  hideGenerator: true,
  searchInComments: true,
  cleanOutputDir: true,
  navigationLinks: {
    Homepage: 'https://www.webmanajemen.com',
    GitHub: 'https://github.com/dimaslanjaka'
  },
  inlineTags: ['@link'],
  readme: join(__dirname, 'readme.md')
};
