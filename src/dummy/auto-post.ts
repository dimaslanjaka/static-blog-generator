import { emptyDirSync, existsSync, mkdirSync } from 'fs-extra';
import gulp from 'gulp';
import { join } from 'upath';
import { write } from '../node/filemanager';
import parsePost, { buildPost, postMap } from '../parser/post/parsePost';
import config, { root } from '../types/_config';

const destFolder = join(root, config.source_dir, '_posts');
if (!existsSync(destFolder)) mkdirSync(destFolder, { recursive: true });
// emptying generated dummy posts
emptyDirSync(join(destFolder, 'dummy'));

export async function generateDummyPosts(n = 5) {
  const result: string[] = [];
  for (let x = 0; x < n; x++) {
    const gen = await dummyPost(x);
    const file = await write(
      join(destFolder, gen.metadata.permalink),
      buildPost(gen)
    );
    result.push(String(file));
  }
  return result;
}

function dummyPost(counter: string | number = 0) {
  const result: postMap = {
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

  return parsePost(join(destFolder, result.metadata.permalink), build);
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

gulp.task('dummy', () => generateDummyPosts(10));
