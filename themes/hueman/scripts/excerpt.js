/**
 * Excerpt Helper
 * @description Get the excerpt from a post
 * @example
 *     <%- excerpt(post) %>
 */
hexo.extend.helper.register('excerpt', function (post) {
  var excerpt;
  if (post.excerpt) {
    excerpt = post.excerpt.replace(/\<[^\>]+\>/g, '');
  } else {
    excerpt = getOnlyText(post.content).substring(0, 200);
  }
  return excerpt;
});

function getOnlyText(str){
  const scriptgx = /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/gmi;
  const defaultgx = /\<[^\>]+\>/g;
  const stylegx = /<style(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/style>/gmi;
  return str.replace(scriptgx, '').replace(stylegx, '').replace(defaultgx, '');
}
