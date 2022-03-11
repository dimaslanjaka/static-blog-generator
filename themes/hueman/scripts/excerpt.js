function getOnlyText(text) {
  let str = text;
  const scriptgx = /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/gim;
  const defaultgx = /\<[^\>]+\>/gm; // default only g
  const stylegx = /<style(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/style>/gim;
  return str.replace(scriptgx, "").replace(stylegx, "").replace(defaultgx, "");
}

function get_excerpt(post) {
  if (post.excerpt) {
    return post.excerpt.replace(/\<[^\>]+\>/g, "");
  } else if (post.content) {
    return getOnlyText(post.content).substring(0, 200);
  } else {
    return getOnlyText(post);
  } 
}

/**
 * Excerpt Helper
 * @description Get the excerpt from a post
 * @example
 *     <%- excerpt(post) %>
 */
hexo.extend.helper.register("excerpt", get_excerpt);
