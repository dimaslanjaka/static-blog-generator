/**
 * Extract Text
 * @param {string} text
 * @returns {string}
 */
function extractText(text) {
  let str = text;
  const scriptgx =
    /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/gim;
  const defaultgx = /\<[^\>]+\>/gm; // default only g
  const stylegx =
    /<style(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/style>/gim;
  return str.replace(scriptgx, '').replace(stylegx, '').replace(defaultgx, '');
}

function get_excerpt(post) {
  if (post.excerpt) {
    return post.excerpt.replace(/\<[^\>]+\>/g, '');
  } else if (post.content) {
    return post.content.replace(/\<[^\>]+\>/g, '').substring(0, 200);
  } else {
    return extractText(post);
  }
}

function excerpt_original(post) {
  let excerpt;
  if (post.excerpt) {
    excerpt = post.excerpt.replace(/\<[^\>]+\>/g, '');
  } else {
    excerpt = post.content.replace(/\<[^\>]+\>/g, '').substring(0, 200);
  }
  return excerpt;
}

/**
 * Excerpt Helper
 * @description Get the excerpt from a post
 * @example
 *     <%- excerpt(post) %>
 */
hexo.extend.helper.register('excerpt', function (post) {
  return excerpt_original(post) || post.title;
});
