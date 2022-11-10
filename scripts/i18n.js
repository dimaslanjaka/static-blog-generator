/* global hexo */

'use strict';

const injector = require('hexo-extend-injector2')(hexo);

injector.register(
  'postMeta',
  ({ __, post, i18n_post_meta, fa_inline }) => {
    const metaContent = Object.keys(post.i18n).map((name) => {
      const link = post.i18n[name];
      return i18n_post_meta(name, link, post.path);
    });
    return `
    <span class="post-meta-item">
      <span class="post-meta-item-icon">
        ${fa_inline('globe', { prefix: 'fas' })}
        <i class="fa fa-globe"></i>
      </span>
      <span class="post-meta-item-text">${__('post.i18n')}</span>
      ${metaContent}
    </span>`;
  },
  (ctx) => ctx.post.i18n
);

hexo.extend.helper.register('i18n_post_meta', function (name, link, path) {
  link = this.url_for(link).replace('index.html', '');
  path = this.url_for(path).replace('index.html', '');
  let postMeta = `<span>${name}</span>`;
  if (link !== path) {
    postMeta = `<a href="${link}">${postMeta}</a>`;
  }
  return postMeta;
});
