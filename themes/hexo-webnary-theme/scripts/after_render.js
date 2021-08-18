"use strict";

const chalk = require("chalk");

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

function MDReadFile(data, hexo) {
  hexo.log.d("Post asset folder path:", chalk.magenta(data.asset_dir));
  // Split by path delimiter, filter out empty string, last one is asset folder's name.
  let asset_dir_name = data.asset_dir
    .split(/[\/\\]/)
    .filter((i) => i)
    .pop();
  hexo.log.d("Post asset folder name:", chalk.magenta(asset_dir_name));

  // TODO: parse readfile tag inside markdown page/post
  let readfile = data.content.match(/\<\!\-\-\s+?readfile\s+?.+?\s+?\-\-\>/gm);
  if (readfile) {
    // if readfile tag found
    hexo.log.d("Readfile:", readfile);
    let match = readfile[0].match(/\<\!\-\-\s+?readfile\s+?(.+?)\s+?\-\-\>/);
    hexo.log.d("match:", match[1]);
  }
}

hexo.extend.filter.register("after_post_render", (data) => {
  lightBox(data);
  MDReadFile(data, hexo);
});
