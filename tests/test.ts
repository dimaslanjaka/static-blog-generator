process.cwd = () => __dirname;

import sbg from '../src/index';

sbg.clean_posts();
