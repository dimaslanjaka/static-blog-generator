const { readdirSync } = require('fs-extra');
const { join } = require('path');

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
    Blog: 'https://www.webmanajemen.com'
  },
  inlineTags: ['@link']
};
