const { join } = require('upath')
const spawn = require('cross-spawn')

const hexoProject = join(__dirname, '../../')

function copyPost() {
  spawn('npm', ['run', 'copy'], { cwd: hexoProject, stdio: 'inherit' })
}

module.exports = {
  hexoProject,
  copyPost
}
