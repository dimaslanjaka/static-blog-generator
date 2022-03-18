/**
 * Thumbnail Helper
 * @description Get the thumbnail url from a post
 * @param {object} post
 * @example
 *     <%- thumbnail(post) %>
 */
function thumbnail(post) {
  var url = post.thumbnail || '';
  if (!url) {
    var imgPattern = /\<img\s.*?\s?src\s*=\s*['|"]?([^\s'"]+).*?\>/gi;
    var result = imgPattern.exec(post.content);
    if (result && result.length > 1) {
      url = result[1];
    }
  }
  return url;
}

hexo.extend.helper.register('thumbnail', thumbnail);

hexo.extend.helper.register('img_url', function (post, config) {
  const cover = thumbnail(post);
  if (/^https?:\/\//gm.test(cover) || /^\//gm.test(cover)) {
    return cover;
  } else if (typeof config.logo == 'string') {
    return config.logo;
  }
  return 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
});

// LOCALES

// AUTHOR
