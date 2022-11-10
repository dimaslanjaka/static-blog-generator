/* global hexo */

'use strict';

const { readFileSync } = require('fs');
const { resolve } = require('path');
const injector = require('hexo-extend-injector2')(hexo);

hexo.extend.generator.register('server-list', () => {
  return {
    path: 'server-list.html',
    data: () => {
      const content = readFileSync(resolve(hexo.base_dir, 'README.md'), 'utf-8');
      const start = content.indexOf('<!-- server-start -->');
      const end = content.indexOf('<!-- server-end -->');
      return hexo.render.render({
        text: content.substring(start, end),
        engine: 'md'
      });
    }
  };
});

hexo.extend.filter.register('after_init', () => {
  const faInline = hexo.extend.helper.get('fa_inline').bind(hexo);
  injector.register('js', `const exclamationSVG = '${faInline('exclamation-circle', {prefix: 'fas'})}'`);
  injector.register('js', `const timesSVG = '${faInline('times', {prefix: 'fas'})}'`);
  injector.register('js', 'views/show-server-list.js');
  injector.register('style', 'views/show-server-list.css');
});
