import axios from 'axios';
import gulp from 'gulp';
import hexo from 'hexo';
import { JSDOM } from 'jsdom';
import { join } from 'path';
import through2 from 'through2';

const instance = new hexo(__dirname);

const posts = instance.locals.get('posts');
console.log(posts);

gulp.task('feed', function () {
  return gulp
    .src('**/*', { cwd: join(__dirname, 'public') })
    .pipe(task())
    .pipe(gulp.dest(join(__dirname, 'tmp/gulp-test')));
});

function task() {
  return through2.obj((file, _enc, callback) => {
    console.log(file.path);
    callback(null);
  });
}

function _scrape() {
  const baseUrl = 'https://www.webmanajemen.com';
  axios.get(baseUrl).then((response) => {
    const content = String(response.data);
    const { window } = new JSDOM(content);
    const { document } = window;
    Array.from(document.querySelectorAll('a'))
      .filter((a) => {
        if (!a.hasAttribute('href')) return false;
        if (a.href.includes(new URL(baseUrl).host)) return true;
        if (a.href.startsWith('/')) return true;
        return false;
      })
      .forEach((a) => {
        console.log(a.href);
      });
  });
}
