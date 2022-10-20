/* eslint-disable no-undef */

if (typeof hexo !== 'undefined') {
  if (/dev/.test(process.env.NODE_ENV)) {
    // dev mode
    require('ts-node').register({ transpileOnly: true });
    require('./src').default(hexo);
  } else {
    require('./dist').default(hexo)
  }
}
