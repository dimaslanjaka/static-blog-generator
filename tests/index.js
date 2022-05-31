process.cwd = () => __dirname;

//const sbg = require('../dist/src');
const sbg = require('static-blog-generator');

// clean
sbg.clean_db(null);
sbg.clean_posts(null);

// copy posts
//sbg.copyPosts();
//sbg.copyAssets();
