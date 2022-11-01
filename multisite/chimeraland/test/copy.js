const spawn = require('cross-spawn')
const { hexoProject } = require('../project')

spawn('npm', ['run', 'copy'], { cwd: hexoProject, stdio: 'inherit' })
