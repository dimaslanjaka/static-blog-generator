// noinspection ES6PreferShortImport
import "./src/js/_Prototype-String";
import * as gulp from "gulp";
import * as path from "path";
import transformPosts, { transformPostBody } from "./src/markdown/transformPosts";
import * as fs from "fs";
import rimraf from "rimraf";
import includeFile from "./src/gulp/include";
import { copyDir, loopDir } from "./src/gulp/utils";
import { shortcodeScript } from "./src/gulp/script";
import { shortcodeNow } from "./src/gulp/time";

/**
 * slash alternative
 * @url {@link https://github.com/sindresorhus/slash}
 * @param path
 */
function slash(path: string) {
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
 * @param cb
 */
// eslint-disable-next-line no-unused-vars
function emptyDir(directory: string, cb: (arg0?: any) => void = null) {
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

      if (typeof cb == "function") cb(directory);
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

let tryCount = 0;

/**
 * Copy source post directly into production posts without transform to multiple languages
 * @param done Callback
 * @param clean Clean All Files And Folder Inside Production Folder
 */
function articleCopy(done, clean = false) {
  if (clean) emptyDir(prodPostDir);
  const srcDir = slash(path.join(__dirname, "src-posts"));
  const destDir = slash(prodPostDir);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  setTimeout(function () {
    // To copy a folder
    copyDir(srcDir, destDir, function (err: any | null) {
      if (err) {
        console.error(err);
        console.error("error");
        if (tryCount == 0) {
          tryCount++;
          return articleCopy(done);
        }
      } else {
        console.log("success!");
      }
    });

    setTimeout(() => {
      // process
      const loop = loopDir(destDir);
      includeFile(destDir);
      loop.forEach(function (file) {
        if (fs.statSync(file).isFile()) {
          shortcodeNow(file);
          shortcodeScript(file);
        }
      });

      // notify gulp process has done
      done();
    }, 1000);
  }, 1000);
}

// just copy from source posts (src-posts) to production posts (source/__posts)
gulp.task("article:copy", function (done) {
  articleCopy(done, true);
});

gulp.task("article:copy:dev", function (done) {
  articleCopy(done, false);
});

gulp.task("article:clean", function (done) {
  emptyDir(prodPostDir);

  done();
});

//gulp.task("default", gulp.series("article:dev", "article:dist"));
gulp.task("default", gulp.series("article:copy:dev"));
