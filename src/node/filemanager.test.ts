import { post_public_dir } from '../types/_config';
import { globSrc } from './filemanager';

const ignore = ['codeblock.*', 'shortcodes', 'dummy'];

globSrc('**/*', {
  ignore: ['unit', 'shortcodes'],
  cwd: post_public_dir,
  use: 'minimatch'
}).then((_files) => {
  console.log(_files);
});
