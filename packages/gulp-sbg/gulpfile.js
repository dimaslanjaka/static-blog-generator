const GulpClient = require('gulp');
const { join } = require('upath');

// copy non-javascript assets from src folder
exports.copy = function () {
  return GulpClient.src(['**/*.*'], { cwd: join(__dirname, 'src'), ignore: ['**/*.{ts,js,json}'] }).pipe(
    GulpClient.dest(join(__dirname, 'dist'))
  );
};
