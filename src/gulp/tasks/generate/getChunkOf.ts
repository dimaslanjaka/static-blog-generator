import { join } from 'path';
import { pcache } from '../../../node/cache';
import { write } from '../../../node/filemanager';
import { postMap } from '../../../parser/post/parsePost';
import { post_chunks, simplifyDump } from '../../../parser/post/postMapper';
import { isDev } from '../../../types/_config';

/**
 * generate tags archive
 * @param labelname specific tag name
 */
export function getChunkOf(
  type: 'tag' | 'category',
  labelname?: string | null
) {
  const cacheInstance =
    type == 'tag'
      ? pcache('tags')
      : type == 'category'
      ? pcache('categories')
      : null;

  if (cacheInstance !== null) {
    const cacheKeys = cacheInstance.keysSync();

    if (!cacheKeys.length) {
      console.log('labels empty');
      return;
    }

    return getChunkOfLabels(cacheInstance, cacheKeys, labelname);
  }
}

/**
 * get post chunk of label
 * @param keys
 * @param labelname
 * @returns
 */
function getChunkOfLabels(
  instance: ReturnType<typeof pcache>,
  keys: string[],
  labelname?: string
) {
  const result: { [key: string]: ReturnType<typeof post_chunks> } = {};
  for (let indexLabel = 0; indexLabel < keys.length; indexLabel++) {
    const tagname = keys[indexLabel];
    const tag_posts = instance.getSync<postMap[][]>(tagname);
    write(
      join(__dirname, 'tmp/getChunkOf/Labels/', indexLabel + '.json'),
      tag_posts
    );
    if (tag_posts.length === 0) {
      console.log(`tag ${tagname} not have post`);
      continue;
    }

    // specific tag label otherwise skip
    if (
      typeof labelname == 'string' &&
      labelname.trim().length > 0 &&
      tagname.toLowerCase() !== labelname.toLowerCase()
    ) {
      // console.log(logname, tagname, '!==', labelname);
      continue;
    }

    result[tagname] = post_chunks(tag_posts);

    if (isDev) {
      console.log(
        tagname,
        tag_posts.length,
        join(__dirname, 'tmp/tags', tagname + '.json')
      );
      write(
        join(__dirname, 'tmp/tags', tagname + '.json'),
        tag_posts.map((post) => simplifyDump(post))
      );
    }
  }
  return result;
}
