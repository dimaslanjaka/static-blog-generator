// noinspection ES6PreferShortImport
import * as gulp from "gulp";
import * as path from "path";
import transformPosts, { transformPostBody } from "./src/markdown/transformPosts";
import * as fs from "fs";
import * as fse from "fs-extra";
import rimraf from "rimraf";

/**
 * slash alternative
 * @url {@link https://github.com/sindresorhus/slash}
 * @param path
 */
function slash(path) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);
  const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

  if (isExtendedLengthPath || hasNonAscii) {
    return path;
  }

  return path.replace(/\\/g, "/");
}

/**
 * Production article.
 * Articles which published on google index
 */
const prodPostDir = path.join(__dirname, "source/_posts");
/**
 * Development article.
 * Articles location for translation
 */
const devPostDir = path.join(__dirname, "build/_posts");

/**
 * Empty all files and folders in directory path
 * @param directory
 */
function emptyDir(directory) {
  if (fs.existsSync(directory))
    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        const fileToDelete = path.join(directory, file);

        if (fs.lstatSync(fileToDelete).isDirectory()) {
          // if sub is directory, rerun function to this subfolder
          emptyDir(fileToDelete);
        }

        rimraf(fileToDelete, function (err) {
          if (err) console.error(err);
        });
      }
    });
}

gulp.task("article:dev", function (done) {
  emptyDir(devPostDir);
  transformPostBody("build/_posts");
  done();
});

gulp.task("article:dist", function (done) {
  emptyDir(prodPostDir);
  transformPosts("source/_posts");
  done();
});

/**
 * Copy source post directly into production posts without transform to multiple languages
 * @param done
 */
function articleCopy(done) {
  emptyDir(prodPostDir);
  const srcDir = slash(path.join(__dirname, "src-posts"));
  const destDir = slash(prodPostDir);

  // To copy a folder
  fse.copy(srcDir, destDir, function (err) {
    if (err) {
      console.error(err);
      console.error("error");
      if (err.path) {
        console.log(err.path);
      }
    } else {
      console.log("success!");
    }
  });

  done();
}

// just copy from source posts (src-posts) to production posts (source/__posts)
gulp.task("article:copy", function (done) {
  articleCopy(done);
});

//gulp.task("default", gulp.series("article:dev", "article:dist"));
gulp.task("default", gulp.series("article:copy"));
