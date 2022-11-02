import { join } from 'path';
import config from '../src/types/_config';
import { startParse } from './startParse';

const post = join(__dirname, '../src-posts/auto-thumbnail.md');
startParse(post, config);
