const hexoLib = require('hexo');

const hexo = new hexoLib(process.cwd());
hexo.init().then(() => {
  hexo.load().then(() => {
    let posts = hexo.locals.get('posts');
    console.log(typeof posts['sort']);
  });
});
