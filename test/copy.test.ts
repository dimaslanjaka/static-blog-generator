import { toUnix } from 'upath';
process.cwd = () => toUnix(__dirname);

import { copyAllPosts } from '../src';

copyAllPosts();
