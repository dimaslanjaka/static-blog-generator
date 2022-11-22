const GulpClient = require('gulp');
const { join } = require('upath');
const typedocOptions = require('./typedoc');

// copy non-javascript assets from src folder
const copy = function () {
  return GulpClient.src(['**/*.*'], { cwd: join(__dirname, 'src'), ignore: ['**/*.{ts,js,json}'] }).pipe(
    GulpClient.dest(join(__dirname, 'dist'))
  );
};

const docs = typedocOptions.run;

exports.copy = copy;
exports.docs = docs;
exports.default = GulpClient.series(copy, docs);
