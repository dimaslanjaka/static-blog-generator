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

const docs = typedocGenerator.run;

function tsc(done) {
  const child = spawn('npm', ['run', 'build'], { cwd: __dirname, stdio: 'inherit' });
  child.once('exit', () => done());
}

exports.copy = copy;
exports.docs = docs;
exports.watch = typedocGenerator.watch;
exports.tsc = tsc;
exports.default = GulpClient.series(tsc, docs);
/**
 * Dump Tasks from dist folder
 * @param {import('gulp').TaskFunctionCallback} done
 */
exports.dumptasks = function (done) {
  const child = spawn('gulp', ['--tasks'], { cwd: join(__dirname, 'dist') });
  let stdout = '';
  child.on('data', (data) => (stdout += data.toString()));
  child.stdout.on('data', function (data) {
    stdout += data.toString();
  });
  child.on('close', () => {
    console.log(stdout);
    if (typeof done === 'function') done.apply();
  });
};
