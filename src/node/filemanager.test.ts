import { post_public_dir } from '../types/_config';
import { globSrc } from './filemanager';

globSrc('**/*', { ignore: 'p', cwd: post_public_dir });
