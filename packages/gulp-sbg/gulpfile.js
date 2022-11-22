const spawn = require('cross-spawn');
const GulpClient = require('gulp');
const { join } = require('upath');
const typedocGenerator = require('./typedoc-runner');

// copy non-javascript assets from src folder
const copy = function () {
  return GulpClient.src(['**/*.*'], { cwd: join(__dirname, 'src'), ignore: ['**/*.{ts,js,json}'] }).pipe(
    GulpClient.dest(join(__dirname, 'dist'))
  );
};

const docs = typedocGenerator;

function tsc(done) {
  const child = spawn('npm', ['run', 'build'], { cwd: __dirname, stdio: 'inherit' });
  child.once('exit', () => done());
}

exports.copy = copy;
exports.docs = docs;
exports.tsc = tsc;
exports.default = GulpClient.series(tsc, docs);
