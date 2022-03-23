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
  // remove duplicates
  images = images.unique();
  // process downloading images
  return (
    bluebird
      .all(images)
      // filter src length > 0 and not local domain
      .filter((src) => src.length > 0 && !src.match(new RegExp("^https?://" + HexoURL.host)))
      .map((src) => {
        // fix if src startwith dynamic protocol `//`
        if (src.startsWith("//")) src = "http:" + src;
        // moved domains ['old domain', 'new domain']
        [["cdn.woorkup.com", "woorkup.com"]].forEach((domainArr) => {
          const regex = new RegExp("^https?://" + domainArr[0], "gi");
          if (src.match(regex)) src = src.replace(regex, "http://" + domainArr[1]);
        });
        return src;
      })
  );
}

function md5(src: string) {
  return crypto.createHash("md5").update(src).digest("hex");
}
