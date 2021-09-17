"use strict";

const chalk = require("chalk");
const fs = require("hexo-fs");
const path = require("path");
const rootFolder = process.cwd();

function lightBox(data) {
  const regex_img = /<img .*?>/gi;
  const regex_rel = /rel="external"/g;

  function getAttributeValue(tag, attribute) {
    const regex = new RegExp("\\b" + attribute + '="([^"]*)"', "i");
    const match = tag.match(regex);

    return " " + attribute + '="' + (match ? match[1] : "") + '"';
  }

  data.content = data.content
    .replace(regex_img, ($0) => {
      let xml = '<img on="tap:lightbox1" role="button" tabindex="0" layout="responsive"';
      xml += getAttributeValue($0, "width");
      xml += getAttributeValue($0, "height");
      xml += getAttributeValue($0, "src");
      xml += getAttributeValue($0, "alt");
      xml += getAttributeValue($0, "title");
      xml += " ></img>";

      return xml;
    })
    .replace(regex_rel, "");

  return data;
}

function MDReadFile(data) {
  if (data.asset_dir) {
    hexo.log.d("Post asset folder path:", chalk.magenta(data.asset_dir));
    // Split by path delimiter, filter out empty string, last one is asset folder's name.
    let asset_dir_name = data.asset_dir
      .split(/[\/\\]/)
      .filter((i) => i)
      .pop();
    hexo.log.d("Post asset folder name:", chalk.magenta(asset_dir_name));
  }

  // TODO: parse readfile tag inside markdown page/post
  let readfile = data.content.match(/\<\!\-\-\s+?readfile\s+?.+?\s+?\-\-\>/gm);
  if (readfile) {
    // if readfile tag found
    hexo.log.d("Readfile:", readfile);
    let match = readfile[0].match(/\<\!\-\-\s+?readfile\s+?(.+?)\s+?\-\-\>/);
    hexo.log.i("Readfile match:", match[1]);
    fs.writeFileSync(path.join(rootFolder, "docs/log/Readfile.json"), JSON.stringify(match, null, 2));
    let loc = path.join(process.cwd(), match[1]);
    if (fs.existsSync(loc)) {
      let read = fs.readFileSync(loc);
      if (read) {
        read = read.toString();
        data.content.replace(match[0], read);
      }
    }
  }

  return data;
}

/**
 * Avoid the circular references.
 * @param {Object} censor
 * @returns
 */
function censor(censor) {
  var i = 0;

  return function (key, value) {
    if (i !== 0 && typeof censor === "object" && typeof value == "object" && censor == value) return "[Circular]";

    if (i >= 29)
      // seems to be a harded maximum of 30 serialized objects?
      return "[Unknown]";

    ++i; // so we know we aren't using the original object anymore

    return value;
  };
}

hexo.extend.filter.register("after_post_render", (data) => {
  lightBox(data);
  //MDReadFile(data);
});
