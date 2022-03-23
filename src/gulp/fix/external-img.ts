import { curly } from "node-libcurl";
import { parsePostReturn } from "../../markdown/transformPosts";
import crypto from "crypto";
import { basename, dirname, join } from "path";
import { cwd } from "process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import "js-prototypes";
import chalk from "chalk";

interface ImgLib {
  /**
   * Image information key from url img
   */
  [key: string]: ImgLibData;
}
interface ImgLibData {
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
if (existsSync(filesave)) {
  libraries = JSON.parse(readFileSync(filesave, "utf-8"));
}

/**
 * Download External Images To Local
 * * Store database on `${workspaceFolder}/source/_data/external-images.json`
 * @param parse parsed
 */
export default function downloadImg(parse: parsePostReturn) {
  // cancel github workflow
  if (typeof process.env.GITFLOW !== "undefined") return;
  if (parse.metadata) {
    let images = [];
    // extract photos from metadata
    const meta = parse.metadata;
    if (meta.cover) images.push(meta.cover);
    if (meta.photos && meta.photos.length) {
      meta.photos.forEach((v) => images.push(v));
    }
    if (meta.thumbnail) images.push(meta.thumbnail);
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

      if (images.length) {
        // remove duplicates
        images = images.unique();
        // process downloading images
        for (let index = 0; index < images.length; index++) {
          let src = images[index].trim();
          // setup key with md5
          const key = crypto.createHash("md5").update(src).digest("hex");
          // setup result data
          const libres: ImgLibData = {
            url: src,
            err: false,
            file: null,
            dir: join(dirname(parse.fileTree.public), basename(parse.fileTree.public, ".md")),
          };
          // only run if key not specified in `libraries`
          if (typeof libraries[key] === "undefined") {
            if (src.startsWith("//")) src = "http:" + src;
            if (src.match(/^https?:\/\//))
              curly
                .get(src, {
                  FOLLOWLOCATION: true,
                  REFERER: "https://www.google.com",
                  SSL_VERIFYPEER: 0,
                  SSL_VERIFYHOST: 0,
                })
                .then((res) => {
                  if (res.statusCode === 200) {
                    const contentType = res.headers[0]["content-type"];
                    if (contentType.startsWith("image/")) {
                      libres.type = contentType;
                      libres.file = join(libres.dir, basename(src));
                      if (!existsSync(libres.dir)) mkdirSync(libres.dir, { recursive: true });
                      writeFileSync(libres.file, res.data);
                      console.log(`${chalk.blueBright("[img]")} saved ${libres.file}`);
                      // add result to `libraries`
                      libraries[key] = libres;
                      // save libraries
                      writeFileSync(filesave, JSON.stringify(libraries));
                    }
                  }
                })
                .catch((err: Error) => {
                  libres.err = err.message;
                })
                .finally(() => {
                  //libraries[key] = libres;
                  //writeFileSync(filesave, JSON.stringify(libraries));
                });
          }
        }
      }
    }
  }
}
