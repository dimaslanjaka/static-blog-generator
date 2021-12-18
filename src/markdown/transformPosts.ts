import filemanager from "../node/filemanager";
import path from "path";
import * as fs from "fs";
import toHtml from "./toHtml";
import yaml from "yaml";
import notranslate from "../translator/notranslate";

type parsePostReturn = Object & {
  /**
   * Article metadata
   */
  metadataString: string;
  /**
   * Article metadata
   */
  metadata: Object & {
    /**
     * Article language code
     */
    lang: string;
    /**
     * Article title
     */
    title: string;
    subtitle: string;
  };
  /**
   * Article body
   */
  body: string;
};

/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return metadata {string & object} and body
 * * return null == failed
 * @param text
 */
export function parsePost(text: string): parsePostReturn | null {
  const regex = /---([\s\S]*?)---/;
  let m: RegExpExecArray | { [Symbol.replace](string: string, replaceValue: string): string }[];

  if ((m = regex.exec(text)) !== null) {
    if (m.hasOwnProperty(0)) {
      return {
        metadataString: m[0],
        metadata: yaml.parse(m[1]),
        body: text.replace(m[0], ""),
      };
    }
  }
  return null;
}

/**
 * Transform only post body without metadata
 * @param outputDir custom output, default source/_posts
 * @param callback
 */
export function transformPostBody(
  outputDir = "source/_posts",
  // eslint-disable-next-line no-unused-vars
  callback?: (filename: string, filedir: string, filepath: string) => any
) {
  filemanager.readdir(path.join(__dirname, "../../src-posts"), function (err, results) {
    if (!err) {
      results.forEach(function (file) {
        const read = fs.readFileSync(file, { encoding: "utf-8" });
        const filename = path.basename(file, ".md") + ".html";
        const filedir = path.normalize(path.dirname(file).replace("src-posts", outputDir));
        const filepath = path.join(filedir, filename);
        //console.log(filename, filedir, filepath);
        if (typeof callback == "function") {
          callback(filename, filedir, filepath);
        }
        const parse = parsePost(read);
        //console.log(parse.metadata); //<--- debug
        if (parse && parse.hasOwnProperty("body")) {
          const html = toHtml(parse.body);
          const filter_notranslate = notranslate(html);
          filemanager.write(filepath, String(filter_notranslate));
        }
      });
    }
  });
}

/**
 * Transform entire post
 * @param outputDir custom output, default source/_posts
 */
export default function (outputDir = "source/_posts") {
  filemanager.readdir(path.join(__dirname, "../../src-posts"), function (err, results) {
    if (!err) {
      results.forEach(function (file) {
        const read = fs.readFileSync(file, { encoding: "utf-8" });
        const filename = path.basename(file);
        const filedir = path.normalize(path.dirname(file).replace("src-posts", outputDir));
        const filepath = path.join(filedir, filename);
        const parse = parsePost(read);
        if (parse !== null && parse.hasOwnProperty("body")) {
          const html = toHtml(parse.body);
          const filter_notranslate = notranslate(html);
          fs.writeFileSync(filepath, `${parse.metadataString}\n\n${filter_notranslate}`);
        }
      });
    }
  });
}
