/**
 * Excerpt Helper
 * @description Get the excerpt from a post
 * @example
 *     <%- excerpt(post) %>
 */
function excerpt(post) {
  var excerpt;
  if (post.excerpt) {
    excerpt = post.excerpt.replace(/\<[^\>]+\>/g, '');
  } else {
    excerpt = getOnlyText(post.content).substring(0, 200);
  }
  return excerpt;
}

function getOnlyText(str){
  const scriptgx = /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/gmi;
  const defaultgx = /\<[^\>]+\>/gm; // default only g
  const stylegx = /<style(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/style>/gmi;
  str = str.replace(scriptgx, '');
  str = str.replace(stylegx, '');
  str = str.replace(defaultgx, '');
  return str;
}

hexo.extend.helper.register('excerpt', excerpt);
