/*
copyAssets(['shortcode']).then((copied) => {
  console.log(copied);
});
*/

import { globSrc } from '../../../node/filemanager';
import config, { post_source_dir } from '../../../types/_config';

globSrc('*/**', {
  cwd: post_source_dir,
  ignore: config.exclude.concat(['**/*.md'])
}).then((files) => console.log(files));
