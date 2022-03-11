/**
 * Excerpt Helper
 * @description Get the excerpt from a post
 * @example
 *     <%- excerpt(post) %>
 */
function get_excerpt(post) {
  var excerpt;
  if (post.excerpt) {
    excerpt = post.excerpt.replace(/\<[^\>]+\>/g, "");
  } else if (post.content) {
    excerpt = getOnlyText(post.content).substring(0, 200);
  } else {
    return getOnlyText(post);
  }
  return excerpt;
}

function getOnlyText(text) {
  let str = text;
  const scriptgx = /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/gim;
  const defaultgx = /\<[^\>]+\>/gm; // default only g
  const stylegx = /<style(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/style>/gim;
  return str.replace(scriptgx, "").replace(stylegx, "").replace(defaultgx, "");
}

hexo.extend.helper.register("excerpt", get_excerpt);
