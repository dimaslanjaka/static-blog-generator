const fs = require('fs');
const { cwd } = require('process');
const { join, dirname } = require('path');
const util = require('util');

function list_post_by_updated(posts) {
  const dumpfile = join(cwd(), 'themes/hueman/tmp/debug');
  if (!fs.existsSync(dumpfile)) {
    const file = join(cwd(), 'themes/hueman/tmp/posts.log');
    if (!fs.existsSync(dirname(file))) fs.mkdirSync(dirname(file), { recursive: true });
    fs.writeFileSync(file, util.inspect(posts));
    fs.writeFileSync(dumpfile, new Date());
  }
  return posts;
}

hexo.extend.helper.register('list_post_by_updated', function (posts) {
  return list_post_by_updated(posts);
});
