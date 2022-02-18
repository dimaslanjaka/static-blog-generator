/**
 * Thumbnail Helper
 * @description Get the thumbnail url from a post
 * @example
 *     <%- thumbnail(post) %>
 */
hexo.extend.helper.register("thumbnail", function (post) {
  var url = post.thumbnail || "";
  if (!url) {
    var imgPattern = /\<img\s.*?\s?src\s*=\s*['|"]?([^\s'"]+).*?\>/gi;
    var result = imgPattern.exec(post.content);
    if (result && result.length > 1) {
      url = result[1];
    }
  }
  return url;
});

hexo.extend.helper.register("get_author_name", function (post, config) {
  if (post && post.author) {
    if (post.author.name) return post.author.name;
    if (post.author.nick) return post.author.nick;
    return post.author;
  } else if (config && config.author) {
    if (config.author.name) return config.author.name;
    if (config.author.nick) return config.author.nick;
    return config.author;
  }
  return "Default Author";
});
