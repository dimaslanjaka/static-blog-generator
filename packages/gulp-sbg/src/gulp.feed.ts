import { PathOrFileDescriptor, readFileSync, writeFileSync } from 'fs';
import gulp from 'gulp';
import gulpDom from 'gulp-dom';
import hexo from 'hexo';
import { full_url_for, gravatar } from 'hexo-util';
import nunjucks from 'nunjucks';
import { join } from 'upath';
import ProjectConfig, { commonIgnore } from './gulp.config';
import envNunjucks from './utils/nunjucks-env';

const env = envNunjucks();

gulp.task('feed', function (done) {
  const instance = new hexo(process.cwd());

  instance.init().then(() => {
    instance.load().then(() => {
      env.addFilter('formatUrl', (str) => {
        return full_url_for.call(instance, str);
      });
      const config = ProjectConfig;

      function build(tmplSrc: PathOrFileDescriptor, dest: PathOrFileDescriptor) {
        const template = nunjucks.compile(readFileSync(tmplSrc, 'utf-8'), env);

        let posts = instance.locals.get('posts');
        posts = posts.sort('-date');
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

        writeFileSync(dest, data);
      }

      const templateRSS = join(__dirname, '_config_template_rss.xml');
      const destRSS = join(process.cwd(), config.public_dir, 'rss.xml');
      build(templateRSS, destRSS);

      const templateATOM = join(__dirname, '_config_template_atom.xml');
      const destATOM = join(process.cwd(), config.public_dir, 'atom.xml');
      build(templateATOM, destATOM);

      const baseURL = config.url.endsWith('/') ? config.url : config.url + '/';

      const publicDir = join(process.cwd(), config.public_dir);
      gulp
        .src('**/*.html', { cwd: publicDir, ignore: commonIgnore })
        .pipe(
          gulpDom(function () {
            // auto discovery rss
            if (this.querySelectorAll(`link[href="${baseURL}rss.xml"]`).length === 0) {
              this.head.innerHTML += `<link id="rss-site-url" type="application/rss+xml" rel="alternate" href="${baseURL}rss.xml" />`;
            }
            // auto discovery atom
            if (this.querySelectorAll(`link[href="${baseURL}atom.xml"]`).length === 0) {
              this.head.innerHTML += `<link id="atom-site-url" type="application/atom+xml" rel="alternate" href="${baseURL}atom.xml" />`;
            }
            //this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
          })
        )
        .pipe(gulp.dest(publicDir))
        .once('end', () => done());
    });
  });
});
