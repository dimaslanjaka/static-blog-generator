import { join } from 'path';
import config from '../src/types/_config';
import { startParse } from './startParse';

const post = join(__dirname, 'src-posts/no-title.md');
startParse(post, config);
