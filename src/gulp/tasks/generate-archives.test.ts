import { write } from '../../node/filemanager';
import MeasureTime from '../../node/measure-timing';
import { post_chunks, simplifyDump } from '../../parser/post/postMapper';
import { tmp } from '../../types/_config';
import { generateIndex } from './generate-archives';

const measure = new MeasureTime();
measure.run(async () => await generateIndex('homepage'), 'generate homepage');

function _debugChunks() {
  // simplify debug
  const chunks = post_chunks();
  chunks[0].map(simplifyDump);
  write(tmp('chunks', 'posts.log'), JSON.stringify(chunks[0], null, 4))
    .then(console.log)
    .then(() => console.log(measure.end()));
}
