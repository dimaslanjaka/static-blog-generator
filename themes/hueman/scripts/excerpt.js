/**
 * Extract Text
 * @param {string} text
 * @returns {string}
 */
function extractText(text) {
  return text.replace(
    /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>|<style(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/style>/gm,
    '',
  );
}

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
  return excerpt.replace(/[\"\']/, '');
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
