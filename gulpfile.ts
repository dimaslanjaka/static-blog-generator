/* eslint-disable @typescript-eslint/no-unused-vars */
//import "./packages/hexo-seo/packages/js-prototypes/src/globals";
//import "./src/node/console";
import "js-prototypes";
import * as gulp from "gulp";
import { hashElement } from "folder-hash";
import md5File from "md5-file";
import { execSync } from "child_process";
import * as path from "path";
import { parsePost, uuidv4 } from "./src/markdown/transformPosts";
import * as fs from "fs";
import rimraf from "rimraf";
import minifyHtml from "./src/gulp/minify";
import { TaskCallback } from "undertaker";
import { writeFileSync } from "./packages/hexo-blogger-xml/src/parser/util";
import shortcodeInclude from "./src/gulp/shortcode/include";
import { copyDir, loopDir, slash } from "./src/gulp/utils";
import GoogleNewsSitemap, { ClassItemType } from "./packages/google-news-sitemap/src";
import moment from "moment";
import { shortcodeScript } from "./src/gulp/shortcode/script";
import { shortcodeNow } from "./src/gulp/shortcode/time";
import { shortcodeCss } from "./src/gulp/shortcode/css";
import replaceMD2HTML from "./src/gulp/fix/hyperlinks";
import extractText from "./src/gulp/shortcode/extract-text";
import YAML from "yaml";
import gulpCore from "./packages/hexo-blogger-xml/src/gulp-core";
//import { gulpCore } from "hexo-blogger-xml";

/**
 * Source folder articles
 */
const srcPostDir = path.join(__dirname, "src-posts");

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

let tryCount = 0;
/**
 * Copy source post directly into production posts without transform to multiple languages
 * @param done Callback
 */
function articleCopy(done: TaskCallback) {
  //if (process.env.NODE_ENV == "development") emptyDir(prodPostDir);
  const srcDir = slash(srcPostDir);
  const destDir = slash(prodPostDir);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

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
      console.log("copied successful!");
      console.log("starting process article shortcodes...");

      // process
      const loop = loopDir(destDir);
      loop.forEach(function (file) {
        const sourceFile = file.replace("/source/_posts/", "/src-posts/");
        if (fs.statSync(file).isFile() && file.endsWith(".md")) {
          const parse = parsePost(file);
          if (parse) {
            if (parse.metadata) {
              // fix post time
              if (parse.metadata.modified) {
                if (!parse.metadata.updated) {
                  parse.metadata.updated = moment(parse.metadata.modified).format("YYYY-MM-DDTHH:mm:ssZ");
                } else {
                  const updated = moment(parse.metadata.updated);
                  const modified = moment(parse.metadata.modified);
                  const same = updated.isSame(modified, "date");
                  //console.log('updated', updated);
                  //console.log('modified', modified);
                  //console.log('same', same);
                  if (!same) {
                    // java format yyyy-MM-dd'T'HH:mm:ssZ
                    parse.metadata.updated = moment(parse.metadata.modified).format("YYYY-MM-DDTHH:mm:ssZ");
                    //console.log(parse.metadata.updated)
                  }
                }
              }
              const stats = fs.statSync(sourceFile);
              if (!parse.metadata.updated) {
                const mtime = stats.mtime;
                parse.metadata.updated = moment(mtime).format("YYYY-MM-DDTHH:mm:ssZ");
              } else {
                const mtime = stats.mtime;
                const modified_file = moment(mtime).format("YYYY-MM-DDTHH:mm:ssZ");
                // if modified today, try get modification date from git commit
                const isToday = moment(modified_file).isSame(moment(), "day"); // O/P : **true**
                if (isToday) {
                  // console.log(parse.metadata.title, parse.metadata.updated, modified_file);
                  // parse.metadata.updated = modified_file;
                  // get modified date from git commit date
                  const stdout = execSync('git log -1 --pretty="format:%cD" ' + sourceFile, { encoding: "utf8" });
                  const format_stdout = moment(stdout.trim()).format("YYYY-MM-DDTHH:mm:ssZ");
                  parse.metadata.updated = format_stdout;
                }
              }
              if (!parse.metadata.date.includes("+")) {
                parse.metadata.date = moment(parse.metadata.date).format("YYYY-MM-DDTHH:mm:ssZ");
              }
              // fix lang
              if (!parse.metadata.lang) parse.metadata.lang = "en";
              // fix post description
              if (parse.metadata.subtitle) {
                if (!parse.metadata.description) parse.metadata.description = parse.metadata.subtitle;
                if (!parse.metadata.excerpt) parse.metadata.excerpt = parse.metadata.subtitle;
              }
              if (parse.metadata.excerpt) {
                if (!parse.metadata.description) parse.metadata.description = parse.metadata.excerpt;
                if (!parse.metadata.subtitle) parse.metadata.subtitle = parse.metadata.excerpt;
              }
              if (parse.metadata.description) {
                if (!parse.metadata.excerpt) parse.metadata.excerpt = parse.metadata.description;
                if (!parse.metadata.subtitle) parse.metadata.subtitle = parse.metadata.description;
              }
              // fix thumbnail
              if (parse.metadata.cover) {
                if (!parse.metadata.thumbnail) parse.metadata.thumbnail = parse.metadata.cover;
                if (!parse.metadata.photos) {
                  parse.metadata.photos = [];
                }
                parse.metadata.photos.push(parse.metadata.cover);
              }
              if (parse.metadata.photos) {
                let photos: string[] = parse.metadata.photos;
                parse.metadata.photos = photos.unique();
              }
              // merge php js css to programming
              if (Array.isArray(parse.metadata.tags)) {
                const containsTag = [
                  "php",
                  "css",
                  "js",
                  "kotlin",
                  "java",
                  "ts",
                  "typescript",
                  "javascript",
                  "html",
                ].some((r) => {
                  const matchTag = parse.metadata.tags.map((str) => str.trim().toLowerCase()).includes(r);
                  if (matchTag) {
                    parse.metadata.category.push(r.toUpperCase());
                  }
                  return matchTag;
                });
                if (containsTag) {
                  parse.metadata.category.push("Programming");
                  if (parse.metadata.category.includes("Uncategorized")) {
                    parse.metadata.category = parse.metadata.category.filter((e) => e !== "Uncategorized");
                  }
                }
                // remove duplicated tags and categories
                parse.metadata.category = parse.metadata.category.unique();
                parse.metadata.tags = parse.metadata.tags.unique();
                // move 'programming' to first index
                parse.metadata.category.forEach((str, i) => {
                  if (str === "Programming") {
                    parse.metadata.category = parse.metadata.category.move(i, 0);
                  }
                });
                //if (parse.metadata.category.includes("Programming")) console.log(parse.metadata.category);
              }
            }

            if (parse.body) {
              parse.body = shortcodeInclude(file, parse.body);
              parse.body = shortcodeNow(file, parse.body);
              parse.body = shortcodeScript(file, parse.body);
              parse.body = replaceMD2HTML(file, parse.body);
              parse.body = shortcodeCss(file, parse.body);
              parse.body = extractText(file, parse.body);
            }

            if (parse.metadata && parse.body) {
              const rebuildPost = `---\n${YAML.stringify(parse.metadata)}---\n\n${parse.body}`;
              writeFileSync(file, rebuildPost);
            }
          }
        }
      });

      // notify gulp process has done
      done();
    }
  });
}

// just copy from source posts (src-posts) to production posts (source/_posts)
gulp.task("article:copy", function (done) {
  articleCopy(done);
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

gulp.task("hexo:minify", function () {
  return gulp
    .src("docs/**/*.html")
    .pipe(minifyHtml({ collapseWhitespace: true, minifyJS: true, minifyCSS: true }))
    .pipe(gulp.dest("docs"));
});

/**
 * Read directory recursive
 * @param dir
 * @param done
 */
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

function sitemap(done?: TaskCallback) {
  const results: string[] = [];
  return new Promise((resolve, reject) => {
    walk("source", (err, files) => {
      const filter = files
        .filter((file) => {
          return (
            /\.(md|html)$/.test(file) && !/\/readme.md$/.test(file.toLowerCase()) && !/\/Test\/|\/404\.html/.test(file)
          );
        })
        .map((file) => {
          return file
            .replace(/\.md$/, ".html")
            .replace("_posts/", "")
            .replace(path.join(__dirname, "source"), "https://www.webmanajemen.com")
            .replace(/ /gm, "%20");
        });
      results.addAll(filter);
      if (results.length) {
        fs.writeFileSync(path.join(__dirname, "docs/sitemap.txt"), results.join("\n"));
      }
      if (typeof done == "function") done();
      resolve(results);
    });
  });
}

// sitemap.txt generator
gulp.task("sitemap", (done) => {
  return sitemap(done);
});

// google news sitemap generator
gulp.task("sitemap-gn", (done) => {
  const sitemaps = new GoogleNewsSitemap();
  walk("source", (err, files) => {
    files
      .filter((file) => {
        return /\.md$/.test(file) && !/\/Test\/|\/404\//.test(file);
      })
      .forEach((file) => {
        const contentMD = fs.readFileSync(file).toString();
        const parse = parsePost(contentMD);
        if (parse) {
          if (!parse.metadata || !parse.metadata.title || !parse.metadata.author || !parse.metadata.date) {
            //console.log("metadata not found", file);
            return;
          }
          //console.log(parse.metadata);
          const build: ClassItemType = {
            publication_name: "",
            publication_language: "",
            publication_date: "",
            title: "",
            location: "",
          };

          // parse post language
          if (typeof parse.metadata.lang == "string" && parse.metadata.lang.length) {
            build.publication_language = parse.metadata.lang;
          }

          // parse post title
          build.title = parse.metadata.title;
          if (parse.metadata.webtitle) build.title += " | " + parse.metadata.webtitle;

          // parse post author
          build.publication_name = "Dimas Lanjaka";
          if (typeof parse.metadata.publisher_name == "string") {
            build.publication_name = parse.metadata.author;
          } else if (typeof parse.metadata.author.nick == "string") {
            build.publication_name = parse.metadata.author.nick;
          } else if (typeof parse.metadata.author.nickname == "string") {
            build.publication_name = parse.metadata.author.nickname;
          } else if (typeof parse.metadata.author.name == "string") {
            build.publication_name = parse.metadata.author.name;
          }

          // parse date using YYYY-MM-DDThh:mm:ssTZD
          if (typeof parse.metadata.date == "string" && parse.metadata.date.length) {
            try {
              build.publication_date = moment(parse.metadata.date, moment.ISO_8601).format(
                GoogleNewsSitemap.date_pattern
              );
            } catch (e) {
              console.log("fail", parse.metadata.date);
            }
            //console.log(build.publication_date);
          }

          // parse genre
          if (typeof parse.metadata.genre == "string") {
            build.genres = parse.metadata.genre;
          } else if (Array.isArray(parse.metadata.genre)) {
            build.genres = parse.metadata.genre.join(",");
          } else {
            build.genres = "Blog";
          }

          // parse keywords
          if (typeof parse.metadata.keywords == "string") {
            build.keywords = parse.metadata.keywords;
          } else if (Array.isArray(parse.metadata.keywords)) {
            build.keywords = parse.metadata.keywords.join(",");
          }

          const url = file
            .replace(/\.md$/, ".html")
            .replace("_posts/", "")
            .replace(path.join(__dirname, "source"), "https://www.webmanajemen.com")
            .replace(/ /gm, "%20");
          build.location = url;
          const temp = path.join(
            "build/google-news-sitemap",
            file.replace(/\.md$/, ".json").replace("_posts/", "").replace(path.join(__dirname, "source"), "")
          );
          if (build.publication_date == "Invalid date") {
            parse.metadata.error = "INVALID DATE";
            parse.metadata.path = file;
            console.log(parse.metadata);
          } else {
            sitemaps.add(build);
          }
          writeFileSync(temp, JSON.stringify(parse, null, 2));
        } else {
          //console.error("cannot parse", file);
        }
      });
    writeFileSync("docs/sitemap-google-news.xml", sitemaps.toString());
    if (typeof done == "function") done();
  });
});

// update .guid has based on src-posts for github workflow cache
gulp.task("update-hash", (done) => {
  const loc = path.join(__dirname, ".guid");
  const options = {
    folders: { exclude: [".*", "node_modules", "test_coverage"] },
    files: { include: ["*.js", "*.json", "*.ts", "*.md"] },
  };

  hashElement("./src-posts", options)
    .then((hash) => {
      // generate md5 has from package-lock.json
      const pkglock = md5File.sync(path.join(__dirname, "package-lock.json"));
      // write merged uuid v4 from md5 hashes
      writeFileSync(loc, uuidv4(hash.toString() + pkglock));
    })
    .catch((error) => {
      return console.error("hashing failed:", error);
    });
  done();
});

gulp.task("default", gulp.series("article:copy", "update-hash"));
