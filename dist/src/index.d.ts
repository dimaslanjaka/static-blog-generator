import { clean_db, clean_posts, clean_public, clean_tmp } from './gulp/tasks/clean';
import { copyPosts } from './gulp/tasks/copy';
import { copyAssets } from './gulp/tasks/copy/assets';
import { gulpInlineStyle } from './gulp/tasks/copy/remove-inline-style';
import './gulp/tasks/deploy';
import './gulp/tasks/generate';
export { copyPosts, copyAssets, gulpInlineStyle, clean_db, clean_posts, clean_public, clean_tmp };
