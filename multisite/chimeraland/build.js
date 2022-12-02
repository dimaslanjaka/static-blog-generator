require('ts-node').register();
require('./src');
const { copyPost } = require('./project');
const copySrcPost = require('./src/copy-src-posts').default;
const copySource = require('./src/copy-source').default;

copySrcPost().on('end', function () {
  copySource().on('end', function () {
    copyPost();
  });
});
