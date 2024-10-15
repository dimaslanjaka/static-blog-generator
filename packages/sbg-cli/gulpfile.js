import fs from 'fs-extra';
import gulp from 'gulp';
import through2 from 'through2';
import path from 'upath';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyDeclarations() {
  return gulp
    .src('dist/**/*.d.ts') // Adjust the path as needed
    .pipe(
      through2.obj(function (file, _, cb) {
        if (file.isBuffer()) {
          const newFileName = file.path.replace(/\.d\.ts$/, '.d.mts');

          // Create a new file stream with the same content but different extension
          fs.writeFile(newFileName, file.contents, (err) => {
            if (err) {
              cb(new Error(`Failed to write file ${newFileName}: ${err.message}`));
            } else {
              // console.log(`Copied: ${file.path} to ${newFileName}`);
              cb(null, file); // Pass the original file to the next stream
            }
          });
        } else {
          cb(null, file); // Pass the original file to the next stream
        }
      })
    );
}

function copy() {
  return gulp.src(['./src/**/*.{xml,json,xsl}'], { cwd: __dirname }).pipe(gulp.dest('./dist'));
}

gulp.task('copy', gulp.series(copy, copyDeclarations));

gulp.task('default', gulp.series('copy'));
