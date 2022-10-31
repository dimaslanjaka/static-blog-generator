import { join } from 'path';
import config from '../src/types/_config';
import { startParse } from './startParse';

const post = join(__dirname, '../src-posts/shortcode-include.md');
startParse(post, config);
