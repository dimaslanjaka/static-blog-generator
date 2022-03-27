/**
 * Extract Text
 * @todo remove style,script,comment html tag
 * @param {string} text
 * @returns {string}
 */
function extractText(text) {
  return text.replace(
    /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>|<style(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/style>|<!--[\s\S]*?-->/gim,
    '',
  );
}

function cleanString(text) {
  // return text.replace(/[\"\']/gim, '');
  // @see {@link https://stackoverflow.com/a/6555220/6404439}
  // get only text without special chars
  // except space
  // return text.replace(/[^a-zA-Z ]/g, "");
  return text.replace(/^[A-Za-z0-9 ]+$/gm, '');
}

hexo.extend.helper.register('cleanString', cleanString);

function excerpt_original(post) {
  let excerpt;
  if (post.excerpt) {
    excerpt = post.excerpt.replace(/\<[^\>]+\>/g, '');
  } else if (post.subtitle) {
    excerpt = post.subtitle.replace(/\<[^\>]+\>/g, '');
  } else if (post.description) {
    excerpt = post.description.replace(/\<[^\>]+\>/g, '');
  } else {
    excerpt = post.content.replace(/\<[^\>]+\>/g, '').substring(0, 200);
  }
  // remove double/single quotes
  return cleanString(excerpt);
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
