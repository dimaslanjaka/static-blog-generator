import { globSync } from 'glob';
import path from 'path';
import { array_random, noop } from 'sbg-utility';
import { processFile, processFiles } from '../../src/post/copy-utils';
import { fixturesCwd } from '../env.mjs';

// cross-env-shell DEBUG:post
process.env.DEBUG = 'sbg-*,post:*,post';

// tell working directory to fixtures folder
process.cwd = () => fixturesCwd;
const postPaths = globSync('**/*.md', { cwd: path.join(fixturesCwd, 'src-posts'), absolute: true, dot: true });

processFile(
  array_random(postPaths),
  function (content) {
    console.log('content is not empty', content.length > 100);
  },
  noop
);

processFiles(
  postPaths,
  function (file, content) {
    console.log(file, content.length);
  },
  noop
);
