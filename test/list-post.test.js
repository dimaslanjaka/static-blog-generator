process.cwd = () => __dirname;

const hexoLib = require('hexo');

const hexo = new hexoLib(__dirname);
hexo.init().then(() => {
  hexo.load().then(() => {
    let posts = hexo.locals.get('posts').toArray().length;
    let pages = hexo.locals.get('pages').toArray().length;
    console.log({ posts, pages });
  });
});
