import { readFileSync, writeFileSync } from 'fs';
import hexo from 'hexo';
import { encodeURL, full_url_for, gravatar } from 'hexo-util';
import nunjucks from 'nunjucks';
import { join } from 'upath';

const env = new nunjucks.Environment();
env.addFilter('uriencode', (str) => {
  return encodeURL(str);
});

env.addFilter('noControlChars', (str) => {
  return str.replace(/[\x00-\x1F\x7F]/g, ''); // eslint-disable-line no-control-regex
});

const instance = new hexo(process.cwd());

instance.init().then(() => {
  instance.load().then(() => {
    env.addFilter('formatUrl', (str) => {
      return full_url_for.call(instance, str);
    });
    const config = instance.config;

    const tmplSrc = join(__dirname, '_config_template_rss.xml');
    const template = nunjucks.compile(readFileSync(tmplSrc, 'utf8'), env);

    let posts = instance.locals.get('posts').toArray();
    //posts = posts.sort('-date');
    posts = posts.filter((post) => {
      return post.draft !== true;
    });

    const { email, feed, url: urlCfg } = config;
    const { icon: iconCfg } = feed;

    let url = urlCfg;
    if (url[url.length - 1] !== '/') url += '/';

    let icon = '';
    if (iconCfg) icon = full_url_for.call(instance, iconCfg);
    else if (email) icon = gravatar(email, {});

    const feed_url = full_url_for.call(instance, 'rss.xml');

    const data = template.render({
      config,
      url,
      icon,
      posts,
      feed_url
    });

    //writeFileSync(join(__dirname, 'public/atom.xml'), feed.atom1());
    writeFileSync(join(process.cwd(), 'public/rss.xml'), data);
  });
});
