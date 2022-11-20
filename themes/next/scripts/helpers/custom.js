hexo.extend.helper.register('getPosts', function () {
  const { page } = this;
  return page.posts;
});
