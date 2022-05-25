import { existsSync, mkdirSync } from 'fs';
import { join } from 'upath';
import { write } from '../node/filemanager';
import parsePost, {
  buildPost,
  postMap,
  postMeta
} from '../parser/post/parsePost';
import config, { root } from '../types/_config';

const destFolder = join(root, config.source_dir, '_posts/dummy');
if (!existsSync(destFolder)) mkdirSync(destFolder, { recursive: true });

export function generateDummyPosts() {
  for (let x = 0; x < 5; x++) {
    const gen = dummyPost(x);
    write(join(destFolder, gen.metadata.permalink), buildPost(gen)).then(
      (f) => {
        console.log(f);
      }
    );
  }
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
      permalink: '/dummy-post-' + counter + '.md',
      date: randomDate(new Date(2020, 0, 1), new Date(), 0, 24).toISOString()
    },
    body: 'Dummy Post Body ' + counter
  };
  const build = buildPost(result);
  parsePost(build);
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
