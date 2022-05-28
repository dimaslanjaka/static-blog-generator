import { join } from 'path';
import { write } from '../../node/filemanager';
import { post_chunks } from './postMapper';

const postsChunks = post_chunks();
for (const key in postsChunks) {
  if (Object.prototype.hasOwnProperty.call(postsChunks, key)) {
    const element = postsChunks[key];
    if (Array.isArray(element)) {
      postsChunks[key] = element.length;
    }
  }
}
write(join(__dirname, 'tmp/postMapper/post_chunks.json'), postsChunks);
