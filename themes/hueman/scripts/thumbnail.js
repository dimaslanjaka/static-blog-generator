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

const localeMap = {
  en: 'en_US',
  de: 'de_DE',
  es: 'es_ES',
  fr: 'fr_FR',
  hu: 'hu_HU',
  id: 'id_ID',
  it: 'it_IT',
  ja: 'ja_JP',
  ko: 'ko_KR',
  nl: 'nl_NL',
  ru: 'ru_RU',
  th: 'th_TH',
  tr: 'tr_TR',
  vi: 'vi_VN',
};

function get_locale(str) {
  if (str.length === 2 && localeMap[str]) return localeMap[str];
  if (str.length === 5) {
    let territory = [];
    if (str.includes('-')) {
      territory = str.split('-');
    } else {
      territory = str.split('_');
    }

    if (territory.length === 2) return territory[0].toLowerCase() + '_' + territory[1].toUpperCase();
  }
  return 'en';
}

// AUTHOR

hexo.extend.helper.register('get_author_name', function (post, config) {
  if (post && post.author) {
    if (post.author.name) return post.author.name;
    if (post.author.nick) return post.author.nick;
    return post.author;
  } else if (config && config.author) {
    if (config.author.name) return config.author.name;
    if (config.author.nick) return config.author.nick;
    return config.author;
  }
  return 'Default Author';
});
