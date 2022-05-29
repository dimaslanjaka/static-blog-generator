import { join } from 'path';
import { write } from '../../../node/filemanager';
import { simplifyDump } from '../../../parser/post/postMapper';
import { getChunkOf } from './getChunkOf';
import './indexing';

write(
  join(__dirname, 'tmp/getChunkOf/tags.json'),
  simplifyDump(getChunkOf('tag'))
);

write(
  join(__dirname, 'tmp/getChunkOf/categories.json'),
  simplifyDump(getChunkOf('category'))
);
