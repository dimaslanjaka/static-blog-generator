const { join } = require('upath')

const hexoProject = join(__dirname, '../../')

function copyPost() {
  require('./test/copy')
}

module.exports = {
  hexoProject,
  copyPost
}
