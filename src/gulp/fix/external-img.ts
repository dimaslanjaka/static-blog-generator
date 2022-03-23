import { curly } from "node-libcurl";
import { parsePostReturn } from "../../markdown/transformPosts";
import crypto from "crypto";

interface ImgLib {
  /**
   * Image information key from url img
   */
  [key: string]: {
    /**
     * url image
     */
    url: string;
    /**
     * saved to
     */
    file: string;
  };
}
const libraries: ImgLib = {};

/**
 * Download External Images To Local
 * * Store database on `${workspaceFolder}/source/_data/external-images.json`
 * @param parse parsed
 */
export default function downloadImg(parse: parsePostReturn) {
  // cancel github workflow
  if (typeof process.env.GITFLOW !== "undefined") return;
  if (parse.metadata) {
    const images = [];
    // extract photos from metadata
    const meta = parse.metadata;
    if (meta.cover) images.push(meta.cover);
    if (meta.photos && meta.photos.length) {
      meta.photos.forEach((v) => images.push(v));
    }
    if (meta.thumbnail) meta.photos.push(meta.thumbnail);
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
          const src = m[1].trim();
          const key = crypto.createHash("md5").update(src).digest("hex");
          if (typeof libraries[key] == "undefined") {
            curly
              .get(src)
              .then((res) => {
                console.log(res.statusCode);
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        }
      }
    }
  }
}
