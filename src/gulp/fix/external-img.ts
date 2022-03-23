import { curly } from "node-libcurl";
import { parsePostReturn } from "../../markdown/transformPosts";
import crypto from "crypto";
import { basename, dirname, join } from "path";
import { cwd } from "process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmdirSync, unlinkSync, writeFileSync } from "fs";
import "js-prototypes";

export interface ImgLib {
  /**
   * Image information key from url img
   */
  [key: string]: ImgLibData;
}
export interface ImgLibData {
  [key: string]: any;
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
  libraries = JSON.parse(readFileSync(filesave, "utf-8"));
}

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

  // result all images
  let images = [];
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
    for (let index = 0; index < images.length; index++) {
      let src = images[index].trim();
      // setup key with md5
      const key = md5(src);
      // setup result data
      const libres: ImgLibData = {
        url: src,
        err: false,
        file: null,
        dir: join(dirname(parse.fileTree.public), basename(parse.fileTree.public, ".md")),
      };
      /**
       * Download func
       */
      const download = async function (src: string) {
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
            console.log(`starting download ${src}`);
            const { statusCode, data, headers } = await curly.get(src, {
              FOLLOWLOCATION: true,
              REFERER: "https://www.google.com",
              SSL_VERIFYPEER: 0,
              SSL_VERIFYHOST: 0,
            });
            if (statusCode === 200) {
              const contentType = headers[0]["content-type"];
              if (contentType.startsWith("image/")) {
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
                appendFileSync(join(cwd(), "tmp/images.log"), `[img ${parse.fileTree.public}] saved ${libres.file}\n`);
                // add result to `libraries`
                libraries[key] = libres;
              }
            }
          } catch (error) {
            const err: Error = error;
            libres.err = err.message;
          } finally {
            // save libraries with errors
            writeFileSync(filesave, JSON.stringify(libraries));
          }
        }
      };
      // if key not specified in `libraries`
      if (typeof libraries[key] === "undefined") {
        await download(src);
      }
      if (typeof libraries[key] == "object" && libraries[key].file && !libraries[key].err) {
        // check if downloaded file removed
        if (!existsSync(libraries[key].file)) {
          await download(libraries[key].url);
        }
        const fullpath = HexoURL;
        console.log(
          libraries[key].file.replace(new RegExp("^" + cwd()), "").replace(new RegExp("^/source/_posts/"), "/")
        );
      }
    }
  }

  return;
}

function md5(src: string) {
  return crypto.createHash("md5").update(src).digest("hex");
}
