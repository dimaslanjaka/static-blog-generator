process.cwd = () => __dirname;

import standaloneRunner from '../src/gulp.standalone';

standaloneRunner();
