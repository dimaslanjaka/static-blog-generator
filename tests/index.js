const { test } = require('./test');
const sbg = require('../dist/src');

console.log('test using local dependencies');
test(sbg, 'clean');

console.log('clean');
sbg.clean_db(null);
sbg.clean_posts(null);
sbg.clean_tmp(null);
sbg.clean_public(null);
