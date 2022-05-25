import { existsSync, mkdirSync } from 'fs';
import memoizee from 'memoizee';
import { join } from 'upath';
import { write } from '../node/filemanager';
import parsePost, {
  buildPost,
  postMap,
  postMeta
} from '../parser/post/parsePost';
import config, { root } from '../types/_config';

const destFolder = join(root, config.source_dir, '_posts');
if (!existsSync(destFolder)) mkdirSync(destFolder, { recursive: true });
export const generateDummyPosts = memoizee(_generateDummyPosts);
async function _generateDummyPosts(n = 5) {
  const result: string[] = [];
  for (let x = 0; x < n; x++) {
    const gen = dummyPost(x);
    const file = await write(
      join(destFolder, gen.metadata.permalink),
      buildPost(gen)
    );
    result.push(String(file));
  }
  return result;
}

function dummyPost(counter: string | number = 0) {
  type Metadata = Partial<postMeta> & {
    permalink: string;
  };
  interface Result extends postMap {
    metadata: Metadata;
  }
  const result: Result = {
    metadata: {
      title: 'Dummy Post ' + counter,
      category: ['dummy'],
      tags: ['dummy', 'sample'],
      permalink: '/dummy/dummy-post-' + counter + '.md',
      date: randomDate(new Date(2020, 0, 1), new Date(), 0, 24).toISOString()
    },
    body: 'Dummy Post Body ' + counter
  };
  const build = buildPost(result);
  parsePost(join(destFolder, result.metadata.permalink), build);
  return result;
}

/**
 * pick random date from two dates
 * @param start
 * @param end
 * @param startHour
 * @param endHour
 * @returns
 * @example
 * randomDate(new Date(2020, 0, 1), new Date(), 0, 24)
 */
function randomDate(
  start: number | Date,
  end: number | Date,
  startHour: number,
  endHour: number
) {
  const dateEnd = end instanceof Date ? end.getTime() : end;
  const dateStart = start instanceof Date ? start.getTime() : start;
  const date = new Date(+start + Math.random() * (dateEnd - dateStart));
  const hour = (startHour + Math.random() * (endHour - startHour)) | 0;
  date.setHours(hour);
  return date;
}
