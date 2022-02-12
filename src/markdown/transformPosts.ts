import filemanager from "../node/filemanager";
import path from "path";
import * as fs from "fs";
import toHtml from "./toHtml";
import yaml from "yaml";
import notranslate from "../translator/notranslate";
import crypto from "crypto";
import { readFileSync } from "fs";

interface LooseObject {
  [key: string]: any;
}

type parsePostReturn = LooseObject & {
  /**
   * Article metadata
   */
  metadataString: string;
  /**
   * Article metadata
   */
  metadata: LooseObject & {
    /**
     * Article language code
     */
    lang: string;
    /**
     * Article title
     */
    title: string;
    subtitle: string;
    uuid?: string;
    updated?: string;
    date: string;
    description?: string;
  };
  /**
   * Article body
   */
  body: string;
};

/**
 * UUID V4 Generator
 * @param fromString generate based on string (unique based on this string)
 * @returns ex: a2d6fee8-369b-bebc-3d8e-b8ff2faf40d3
 */
export function uuidv4(fromString?: string) {
  let original = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"; // length 8-4-4-4-12
  if (fromString) {
    const hash = md5(fromString);
    original = original
      .replace(/^xxxxxxxx-xxxx/, hash.slice(0, 8) + "-" + hash.slice(9, 13))
      .replace(/xxx-xxxxxxxxxxxx$/, hash.slice(14, 17) + "-" + hash.slice(18, 30));
  }
  return original.replace(/[xy]/g, function (c) {
    if (!fromString) {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    } else {
      const r = 0;
      let v = r | 0x8;
      if (c == "y") v = (r & 0x3) | 0x8;
      return v.toString(16);
    }
  });
}

/**
 * PHP MD5 Equivalent
 * @param data
 * @returns
 */
export function md5(data: string) {
  return crypto.createHash("md5").update(data).digest("hex");
}

/**
 * Parse Hexo markdown post (structured with yaml and universal markdown blocks)
 * * return metadata {string & object} and body
 * * return null == failed
 * @param text
 */
export function parsePost(text: string): parsePostReturn | null {
  ///const regex = /---([\s\S]*?)---/;
  const regex = /^---([\s\S]*?)---\n/gm;
  let m: RegExpExecArray | { [Symbol.replace](string: string, replaceValue: string): string }[];
  const originalArg = text;
  const isFile = fs.existsSync(text) && fs.statSync(text).isFile();
  if (isFile) {
    text = readFileSync(text).toString();
  }

  try {
    if ((m = regex.exec(text)) !== null) {
      if (m[0]) {
        let meta: parsePostReturn["metadata"] = yaml.parse(m[1]); // header post
        //console.log(meta);
        if (!meta.uuid) {
          let uid = m[0];
          if (meta.title && meta.webtitle) {
            uid = meta.title + meta.webtitle;
          } else if (meta.subtitle) {
            uid = meta.subtitle;
          }
          meta.uuid = uuidv4(uid);
          meta = Object.keys(meta)
            .sort()
            .reduce(
              (acc, key) => ({
                ...acc,
                [key]: meta[key],
              }),
              {}
            ) as parsePostReturn["metadata"];
        }
        return {
          metadataString: m[0],
          metadata: meta,
          body: fixPostBody(text.replace(m[0], "")),
        };
      }
    }
  } catch (e) {
    //if (debug) console.error(e.message, originalArg);
    console.log("fail parse markdown post", originalArg);
  }
  return null;
}

/**
 * Fix post body
 * * remove *.wp.com cdn
 * @param str
 */
export function fixPostBody(str: string) {
  // remote i2.wp.com i1.wp.com etc
  const regex = /https?:\/\/i\d{1,4}.wp.com\//gm;
  str = str.replace(regex, "https://res.cloudinary.com/practicaldev/image/fetch/");
  // add notranslate
  if (!str.includes('document.querySelectorAll("pre,code")')) {
    str += `<script>document.querySelectorAll("pre,code");
  pretext.forEach(function (el) {
    el.classList.toggle("notranslate", true);
  });</script>`;
  }
  return str;
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
        if (parse && parse.body) {
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
export default function transformPosts(outputDir = "source/_posts") {
  filemanager.readdir(path.join(__dirname, "../../src-posts"), function (err, results) {
    if (!err) {
      results.forEach(function (file) {
        const read = fs.readFileSync(file, { encoding: "utf-8" });
        const filename = path.basename(file);
        const filedir = path.normalize(path.dirname(file).replace("src-posts", outputDir));
        const filepath = path.join(filedir, filename);
        const parse = parsePost(read);
        if (parse !== null && parse.body) {
          const html = toHtml(parse.body);
          const filter_notranslate = notranslate(html);
          fs.writeFileSync(filepath, `${parse.metadataString}\n\n${filter_notranslate}`);
        }
      });
    }
  });
}
