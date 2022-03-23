import { parsePostReturn } from "../../markdown/transformPosts";

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
 * * Store database on `${workspaceFolder}/tmp/img.json`
 * @param parse parsed
 */
export default function downloadImg(parse: parsePostReturn) {
  if (parse.metadata) {
    const images = [];
    // extract photos from metadata
    const meta = parse.metadata;
    if (meta.cover) images.push(meta.cover);
    if (meta.photos && meta.photos.length) {
      meta.photos.forEach((v) => images.push(v));
    }
    if (meta.thumbnail) meta.photos.push(meta.thumbnail);
  }
  return parse;
}
