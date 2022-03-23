import { curly } from "node-libcurl";
import { parsePostReturn, saveParsedPost } from "../../markdown/transformPosts";
import crypto from "crypto";
import { basename, dirname, join } from "path";
import { cwd } from "process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from "fs";
import "js-prototypes";
import chalk from "chalk";
import bluebird from "bluebird";

export interface ImgLib {
  /**
   * Image information key from url img
   */
  [key: string]: ImgLibData;
}
export interface ImgLibData {
  [key: string]: any;
  /**
   * header content-type
   * @example
   * ```text
   * images/png
   * ```
   */
  type: string;
  /**
   * full path from `hexo.config.url`
   */
  fullpath?: string;
  /**
   * url image
   */
  url: string;
  /**
   * File Path
   */
  file: string;
  /**
   * Folder Path
   */
  dir: string;
  /**
   * Unreachable url, etc
   */
  err: boolean | string | Error;
}

/**
 * @file {@link source/_data/external-images.json}
 * @see {@link tmp/gulp.log}
 */
let libraries: ImgLib = {};
const filesave = join(cwd(), "/source/_data/external-images.json");
export { filesave as imagesDBFile };
if (existsSync(filesave)) {
  try {
    libraries = JSON.parse(readFileSync(filesave, "utf-8"));
  } catch (error) {
    console.log(chalk.red(`JSON DATA LOST at ${new Date()}`));
  }
}

// downloaded keys
const downloadedKeys: string[] = [];

// delete log file
if (existsSync(join(cwd(), "tmp/images.log"))) unlinkSync(join(cwd(), "tmp/images.log"));

/**
 * Download External Images To Local
 * * Store database on `${workspaceFolder}/source/_data/external-images.json`
 * @param parse parsed
 */
export default async function downloadImg(parse: parsePostReturn) {
  if (!parse) return;

  const HexoURL = new URL(parse.config.url);

  // result all images for current post
  let images: string[] = [];
  if (parse.metadata) {
    // extract photos from metadata
    const meta = parse.metadata;
    if (meta.cover) images.push(meta.cover);
    if (meta.photos && meta.photos.length) {
      meta.photos.forEach((v) => images.push(v));
    }
    if (meta.thumbnail) images.push(meta.thumbnail);
  }
  if (parse.body) {
    const regex = /\<img\s.*?\s?src\s*=\s*['|"]?([^\s'"]+).*?\>/gim;
    const str = parse.body;
    let m: RegExpExecArray;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      if (m.length > 1) {
        images.push(m[1].trim());
      }
    }
  }
  if (images.length) {
    // remove duplicates
    images = images.unique();
    // process downloading images
    return bluebird
      .all(images)
      .map((src) => src.trim())
      .map(async (src) => {
        // setup key with md5
        const key = md5(src);
        // setup result data
        const libres: ImgLibData = libraries[key] || {
          type: null,
          url: src,
          err: false,
          file: null,
          dir: join(dirname(parse.fileTree.public), basename(parse.fileTree.public, ".md")),
        };
        /**
         * Download func
         */
        async function download(src: string) {
          // cancel github workflow
          if (typeof process.env.GITFLOW !== "undefined") return;
          // fix if src startwith dynamic protocol `//`
          if (src.startsWith("//")) src = "http:" + src;
          // moved domains
          const domains = [["cdn.woorkup.com", "woorkup.com"]];
          domains.forEach((domainArr) => {
            const regex = new RegExp("^https?://" + domainArr[0], "gi");
            if (src.match(regex)) src = src.replace(regex, "http://" + domainArr[1]);
          });
          // only download valid url and not local domain
          if (src.match(/^https?:\/\//) && !src.match(new RegExp("^https?://" + HexoURL.host))) {
            try {
              //console.log(`${chalk.magenta("[img][try]")} ${key}`);
              const { statusCode, data, headers } = await curly.get(src, {
                FOLLOWLOCATION: true,
                REFERER: "https://www.google.com",
                SSL_VERIFYPEER: 0,
                SSL_VERIFYHOST: 0,
              });
              if (statusCode === 200) {
                const contentType = headers[0]["content-type"];
                if (contentType && contentType.startsWith("image/")) {
                  libres.type = contentType;
                  let imgtype = contentType.replace("image/", "");
                  // fix svg+xml
                  if (imgtype.includes("+")) {
                    imgtype = imgtype.split("+")[0];
                  }
                  libres.file = join(libres.dir, md5(src) + "." + imgtype);
                  if (!existsSync(libres.dir)) mkdirSync(libres.dir, { recursive: true });
                  // save images content
                  writeFileSync(libres.file, data);
                  // save images log
                  appendFileSync(
                    join(cwd(), "tmp/images.log"),
                    `[img ${parse.fileTree.public}] saved ${libres.file}\n`
                  );
                }
              }
            } catch (error) {
              const err: Error = error;
              libres.err = err.message;
            } finally {
              if (!downloadedKeys.includes(key)) downloadedKeys.push(key);

              // add result to `libraries`
              libraries[key] = libres;
              // save libraries
              writeFileSync(filesave, JSON.stringify(libraries));
            }
          }
        }

        // [download] if key not specified in `libraries`
        if (typeof libraries[key] === "undefined") {
          await download(src);
        }

        if (libres.file && !libres.err) {
          // check if downloaded file removed
          if (!existsSync(libres.file)) {
            await download(libres.url);
          }
          // determine full path url
          const fullpath = HexoURL;
          fullpath.pathname = libres.file
            .replace(new RegExp("^" + cwd()), "")
            .replace(new RegExp("^/source/_posts/"), "/");
          libres.fullpath = fullpath.toString();
          // add result to `libraries`
          libraries[key] = libres;
          // save libraries
          writeFileSync(filesave, JSON.stringify(libraries));
        }
        return libres;
      })
      .each((data) => {
        if (data.fullpath) {
          if (!data.err) {
            if (parse.metadata.cover.trim() === data.url) {
              parse.metadata.cover = data.fullpath;
            }
            if (parse.metadata.thumbnail.trim() === data.url) {
              parse.metadata.thumbnail = data.fullpath;
            }
            if (Array.isArray(parse.metadata.photos)) {
              parse.metadata.photos.map((img) => {
                if (img.trim() == data.url) return data.fullpath;
                return img;
              });
            }
            if (parse.body) {
              parse.body.replace(data.url, data.fullpath);
            }
            //console.log(parse.fileTree.public);
            saveParsedPost(parse, parse.fileTree.public);
          }
        }
      });
  }
}

function md5(src: string) {
  return crypto.createHash("md5").update(src).digest("hex");
}
