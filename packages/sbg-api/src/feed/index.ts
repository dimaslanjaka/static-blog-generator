import Bluebird from 'bluebird';
import fs from 'fs-extra';
import gulp, { TaskFunctionCallback } from 'gulp';
import Hexo from 'hexo';
import hutil from 'hexo-util';
import nunjucks from 'nunjucks';
import { commonIgnore, envNunjucks, getConfig, gulpDom } from 'sbg-utility';
import path from 'upath';
import { gulpOpt, NodeCallback } from '../gulp-options';

const env = envNunjucks();

/**
 * generate feed with hexo
 * @param done
 * @param config
 */
export function hexoGenerateFeed(done?: NodeCallback, config = getConfig()) {
  const instance = new Hexo(config.cwd);

  return new Bluebird((resolve) => {
    instance.init().then(() => {
      instance.load().then(() => {
        env.addFilter('formatUrl', (str: string | undefined) => {
          return hutil.full_url_for.call(instance, str);
        });

        function build(tmplSrc: fs.PathOrFileDescriptor, dest: fs.PathOrFileDescriptor) {
          const template = nunjucks.compile(fs.readFileSync(tmplSrc, 'utf-8'), env);

          let posts = instance.locals.get('posts');
          posts = posts.sort('-date');
          posts = posts.filter((post: { draft: boolean }) => {
            return post.draft !== true;
          });

          const email = config.email;
          const urlCfg = config.url;
          const iconCfg = config.feed.icon;

          let url = urlCfg;
          if (url[url.length - 1] !== '/') url += '/';
          // remove broken hexo lang shortcode
          if (url.includes(':lang/')) url = url.replace('/:lang/', '/');

          let icon = '';
          if (iconCfg) {
            icon = hutil.full_url_for.call(instance, iconCfg) as string;
          } else if (email) {
            icon = hutil.gravatar(email, {});
          }

          const feed_url = hutil.full_url_for.call(instance, 'rss.xml');

          const data = template.render({
            config,
            url,
            icon,
            posts,
            feed_url
          });

          fs.writeFileSync(dest, data);
        }

        const templateRSS = path.join(__dirname, '_config_template_rss.xml');
        const destRSS = path.join(config.cwd, config.public_dir, 'rss.xml');
        build(templateRSS, destRSS);

        const templateATOM = path.join(__dirname, '_config_template_atom.xml');
        const destATOM = path.join(config.cwd, config.public_dir, 'atom.xml');
        build(templateATOM, destATOM);

        const baseURL = config.url.endsWith('/') ? config.url : config.url + '/';

        const publicDir = path.join(config.cwd, config.public_dir);
        gulp
          .src('**/*.html', { cwd: publicDir, ignore: commonIgnore } as gulpOpt)
          .pipe(
            gulpDom(function () {
              // auto discovery rss
              if (
                this.querySelectorAll(`link[href="${baseURL}rss.xml"]`).length === 0 &&
                this.querySelectorAll(`link[href="/rss.xml"]`).length === 0
              ) {
                this.head.innerHTML += `<link id="rss-site-url" type="application/rss+xml" rel="alternate" href="${baseURL}rss.xml" />`;
              }
              // auto discovery atom
              if (
                this.querySelectorAll(`link[href="${baseURL}atom.xml"]`).length === 0 &&
                this.querySelectorAll(`link[href="/atom.xml"]`).length === 0
              ) {
                this.head.innerHTML += `<link id="atom-site-url" type="application/atom+xml" rel="alternate" href="${baseURL}atom.xml" />`;
              }
              //this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
            })
          )
          .pipe(gulp.dest(publicDir))
          .once('end', () => {
            if (typeof done === 'function') {
              done();
            }
            resolve(null);
          });
      });
    });
  });
}

/** gulp task */
export function gulpHexoGeneratedFeed(callback?: TaskFunctionCallback) {
  return hexoGenerateFeed(callback);
}
