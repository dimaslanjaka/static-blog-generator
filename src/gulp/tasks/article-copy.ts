//** copy from src-posts to source/_posts **//

import { existsSync, mkdirSync, statSync } from "fs";
import gulp from "gulp";
import moment from "moment";
import { basename, dirname, join } from "path";
import { parsePost, saveParsedPost } from "../../markdown/transformPosts";
import replaceMD2HTML from "../fix/hyperlinks";
import { shortcodeCss } from "../shortcode/css";
import extractText from "../shortcode/extract-text";
import { shortcodeScript } from "../shortcode/script";
import { shortcodeNow } from "../shortcode/time";
import { copyDir, loopDir, slash } from "../utils";
import { TaskCallback } from "undertaker";
import parseShortCodeInclude from "../shortcode/include";
import { cwd } from "process";
import { Hexo_Config } from "../../../types/_config";

let tryCount = 0;

/**
 * Copy source post directly into production posts without transform to multiple languages
 * @param done Callback
 */
export default function articleCopy(config: Hexo_Config, done: TaskCallback) {
  //if (process.env.NODE_ENV == "development") emptyDir(prodPostDir);
  const srcPostDir = join(cwd(), "src-posts");
  const prodPostDir = join(cwd(), config.source_dir, "/_posts");
  const srcDir = slash(srcPostDir);
  const destDir = slash(prodPostDir);
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

  // To copy a folder
  copyDir(srcDir, destDir, function (err) {
    if (err) {
      console.error(err);
      console.error("error");
      if (tryCount == 0) {
        tryCount++;
        return articleCopy(config, done);
      }
    } else {
      console.log("copied successful!");
      console.log("starting process article shortcodes...");

      // process
      const loop = loopDir(destDir);
      loop.forEach(function (file) {
        const sourceFile = file.replace(prodPostDir, srcPostDir);
        const publicAssetDir = join(dirname(file), basename(file, ".md"));
        const sourceAssetDir = join(dirname(sourceFile), basename(sourceFile, ".md"));
        if (statSync(file).isFile() && file.endsWith(".md")) {
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
              const stats = statSync(sourceFile);
              if (!parse.metadata.updated) {
                const mtime = stats.mtime;
                parse.metadata.updated = moment(mtime).format("YYYY-MM-DDTHH:mm:ssZ");
              }
              if (!parse.metadata.date) {
                parse.metadata.date = moment(new Date()).format("YYYY-MM-DDTHH:mm:ssZ");
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
                  // remove uncategorized if programming category pushed
                  if (parse.metadata.category.includes("Uncategorized")) {
                    parse.metadata.category = parse.metadata.category.filter((e) => e !== "Uncategorized");
                  }
                }
                // remove duplicated tags and categories
                parse.metadata.category = parse.metadata.category.uniqueStringArray();
                parse.metadata.tags = parse.metadata.tags.uniqueStringArray();
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
              parse.body = parseShortCodeInclude(file, parse.body);
              parse.body = shortcodeNow(file, parse.body);
              parse.body = shortcodeScript(file, parse.body);
              parse.body = replaceMD2HTML(file, parse.body);
              parse.body = shortcodeCss(file, parse.body);
              parse.body = extractText(file, parse.body);
            }

            if (parse.metadata && parse.body) {
              // remove duplicated metadata photos
              if (parse.metadata.photos && parse.metadata.photos.length) {
                parse.metadata.photos = parse.metadata.photos.unique();
              }

              // save parsed post to public _config.yml
              saveParsedPost(parse, parse.fileTree.public);
            }
          }
        }
      });

      // notify gulp process has done
      done(null);
    }
  });
}
