/**
 * button.js | https://theme-next.org/docs/tag-plugins/button/
 */

/* global hexo */

'use strict';

const fs = require('fs');
const util = require('hexo-util');
const yaml = require('js-yaml');

function renderShields(data) {

  const htmlTag = util.htmlTag;
  const config = yaml.load(data);

  const items = Object.keys(config).map(key => {
    const value = config[key];
    const aArgs = {
      class: 'un-decoration',
      href: value.href,
      target: value.href || '_blank'
    };
    value.src = value.src || 'https://img.shields.io/badge/' + encodeURI(value.name || key) + '-' + encodeURI(value.des) + '-' + encodeURI(value.color) + '.svg';
    const imgArgs = {
      src: value.src,
      alt: value.alt || key,
      title: value.title
    };
    // <img style="margin:0;float:left;" src="https://img.shields.io/badge/Mail-@dnocm-blue.svg" alt="Mail">
    return htmlTag('a', aArgs,
      htmlTag('img', imgArgs)
      , false);
  });
  return items.join('');
}

hexo.extend.tag.register('shields_data', (args, content) => {
  return renderShields(content);
}, { ends: true });

hexo.extend.tag.register('shields', args => {
  let filePath = args[0];
  if (!filePath) {
    hexo.log.warn('FilePath can NOT be empty');
  }
  if (!(filePath.indexOf('/') === 0)) {
    filePath = 'source/_data/' + filePath;
  }
  if (filePath.indexOf('.') < 0) {
    filePath = filePath + '.yml';
  }
  const data = fs.readFileSync(filePath);
  return renderShields(data);
}, { ends: false });
