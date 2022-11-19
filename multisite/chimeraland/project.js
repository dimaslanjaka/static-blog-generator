const { join } = require('upath');
const spawn = require('cross-spawn');

const hexoProject = join(__dirname, '../../');

function copyPost() {
  console.log('npm run copy on', hexoProject);
  spawn('npm', ['run', 'copy'], { cwd: hexoProject, stdio: 'inherit' });
}

function generateSite() {
  console.log('npm run build on', hexoProject);
  spawn('npm', ['run', 'build'], { cwd: hexoProject, stdio: 'inherit' });
}

module.exports = {
  hexoProject,
  generateSite,
  copyPost
};
