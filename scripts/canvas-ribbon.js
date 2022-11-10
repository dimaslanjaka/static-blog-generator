/* global hexo */

'use strict';

const injector = require('hexo-extend-injector2')(hexo);

const config = Object.assign({
  size: 300,
  alpha: 0.6,
  zIndex: -1,
  url: '//cdn.jsdelivr.net/gh/theme-next/theme-next-canvas-ribbon@1/canvas-ribbon.js'
}, hexo.config.canvas_ribbon);
const script = `<script id="ribbon" size="${config.size}" alpha="${config.alpha}" zIndex="${config.zIndex}" src="${config.url}"></script>`;
injector.register('body_end', script);
