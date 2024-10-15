///
import { testCwd } from './env.mjs';
process.cwd = () => testCwd;
///

import axios from 'axios';
import { noop } from 'sbg-utility';
import findBrokenImages from '../src/post/find-broken-images';

axios
  .get('https://scottaohara.github.io/tests/html-img/broken.html')
  .then((res) => {
    findBrokenImages(res.data);
  })
  .catch(noop);
