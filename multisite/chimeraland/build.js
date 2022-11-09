require('ts-node').register()
const { copyPost } = require('./project')
const copySrcPost = require('./src/copy-src-posts').default

copySrcPost().on('end', function () {
  copyPost()
})
