import { join } from 'path';
import config from '../src/types/_config';
import { startParse } from './startParse';

const post = join(__dirname, '../src-posts/without-description.md');
startParse(post, config);
