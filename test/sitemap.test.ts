process.cwd = () => __dirname;

import { copyAllPosts, hexoGenerateSitemap } from '../src';
import { chain } from '../src/utils/chain';

chain([{ callback: copyAllPosts }, { callback: hexoGenerateSitemap }]);
