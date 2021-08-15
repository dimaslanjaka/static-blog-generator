// noinspection ES6PreferShortImport

import * as gulp from "gulp";
import * as path from "path";
import * as fse from "fs-extra";
import transformPosts, { transformPostBody } from "./src/markdown/transformPosts";
import * as fs from "fs";
import rimraf from "rimraf";

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

/**
 * @see {@link https://stackoverflow.com/a/26038979}
 * @param source
 * @param target
 */
function copyFileSync(source, target) {
  let targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

/**
 * @see {@link https://stackoverflow.com/a/26038979}
 * @param source
 * @param target
 */
// eslint-disable-next-line no-unused-vars
function copyFolderRecursiveSync(source, target) {
  let files = [];

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
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

// just copy from source posts (src-posts) to production posts (src/__posts)
gulp.task("article:copy", function (done) {
  emptyDir(prodPostDir);
  const srcDir = path.join(__dirname, "src-posts");

  // To copy a folder or file
  copyFolderRecursiveSync(srcDir, prodPostDir);
  done();
});

gulp.task("default", gulp.series("article:dev", "article:dist"));
