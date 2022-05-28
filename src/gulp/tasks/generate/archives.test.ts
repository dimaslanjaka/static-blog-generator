import MeasureTime from '../../../node/benchmark/measure-timing';
import { write } from '../../../node/filemanager';
import { post_chunks, simplifyDump } from '../../../parser/post/postMapper';
import { tmp } from '../../../types/_config';
import { generateIndex } from './archives';

const measure = new MeasureTime();
measure
  .run('generate homepage', generateIndex, 'homepage')
  .then(() => measure.run('generate all archive', generateIndex, 'all'))
  .then(() => measure.run('generate archive page 1', generateIndex, 1));

function _debugChunks() {
  // simplifasync y debug
  const chunks = post_chunks();
  chunks[0].map(simplifyDump);
  write(tmp('chunks', 'posts.log'), JSON.stringify(chunks[0], null, 4))
    .then(console.log)
    .then(() => console.log(measure.end()));
}
