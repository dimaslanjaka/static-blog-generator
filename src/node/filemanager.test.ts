import { join } from 'upath';
import { post_public_dir } from '../types/_config';
import { globSrc } from './filemanager';

const ignore = ['codeblock.*', 'shortcodes', 'dummy'];

globSrc('**/*.md', {
  cwd: join(process.cwd(), 'src'),
  ignore: ['**/tmp/**'],
  use: 'minimatch'
}).then((_files) => {
  console.log(_files);
});

export function globSourcePosts() {
  return globSrc('**/*', {
    ignore: ['unit', 'shortcodes'],
    cwd: post_public_dir,
    use: 'minimatch'
  });
}
