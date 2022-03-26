function list_post_by_updated(posts) {
  return posts;
}

hexo.extend.helper.register('list_post_by_updated', function (posts) {
  return list_post_by_updated(posts);
});
