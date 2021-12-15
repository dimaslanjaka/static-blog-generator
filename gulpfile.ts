/* eslint-disable @typescript-eslint/no-unused-vars */
import "./src/js/_Prototype-String";
import * as gulp from "gulp";
import * as path from "path";
import transformPosts, { transformPostBody } from "./src/markdown/transformPosts";
import * as fs from "fs";
import rimraf from "rimraf";
import includeFile from "./src/gulp/include";
import { copyDir, loopDir, slash } from "./src/gulp/utils";
import { shortcodeScript } from "./src/gulp/shortcode/script";
import { shortcodeNow } from "./src/gulp/shortcode/time";
import { shortcodeCss } from "./src/gulp/shortcode/css";
import gulpCore from "./packages/hexo-blogger-xml/src/gulp-core";
//import { gulpCore } from "hexo-blogger-xml";
import "./src/js/_Prototype-Array";

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
    copyDir(srcDir, destDir, function (err) {
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
          shortcodeCss(file);
        }
      });

      // notify gulp process has done
      done();
    }, 1000);
  }, 1000);
}

// just copy from source posts (src-posts) to production posts (source/_posts)
gulp.task("article:copy", function (done) {
  articleCopy(done, true);
});

gulp.task("article:copy:dev", function (done) {
  articleCopy(done, false);
});

gulp.task("article:clean", function (done) {
  emptyDir(prodPostDir);
  fs.mkdirSync(prodPostDir, { recursive: true });

  done();
});

gulp.task("blogger", function (done) {
  ["araka_id.xml" /*"webmanajemen.com.xml"*/].forEach((xml) => {
    const mainXML = path.resolve("./userscripts/xml/" + xml);
    ///const testXML = path.resolve("packages/hexo-blogger-xml/xml/test.xml");
    gulpCore({
      input: [mainXML],
      output: "./build/src-posts",
      hostname: ["webmanajemen.com", "www.webmanajemen.com", "dimaslanjaka.github.io", "movies.webmanajemen.com"],
      callback: require("./userscripts/post_callback"),
      on: {
        finish: (_parser) => {
          console.log("Blogger gulp finished");
        },
      },
    });
  });

  done();
});

import minifyHtml from "./src/gulp/minify";
gulp.task("hexo:minify", function () {
  return gulp
    .src("docs/**/*.html")
    .pipe(minifyHtml({ collapseWhitespace: true, minifyJS: true, minifyCSS: true }))
    .pipe(gulp.dest("docs"));
});

function walk(dir: fs.PathLike, done: { (err: NodeJS.ErrnoException, files: string[]): void }) {
  let results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err, null);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir.toString(), file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
}
gulp.task("sitemap", (done) => {
  const results: string[] = [];
  walk("source", (err, files) => {
    const filter = files
      .filter((file) => {
        return /\.(md|html)$/.test(file) && !/\/Test\/|\/404\.html/.test(file);
      })
      .map((file) => {
        return file
          .replace(/\.md$/, ".html")
          .replace("_posts/", "")
          .replace(path.join(__dirname, "source"), "https://www.webmanajemen.com").replace(/\s/,'%20')
      });
    results.addAll(filter);
    if (results.length) {
      fs.writeFileSync(path.join(__dirname, "docs/sitemap.txt"), results.join("\n"));
    }
    done();
  });
});

//gulp.task("default", gulp.series("article:dev", "article:dist"));
gulp.task("default", gulp.series("article:copy:dev"));
//exports.default = gulp.series("article:copy:dev");
