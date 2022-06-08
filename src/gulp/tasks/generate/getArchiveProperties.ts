import { join } from 'upath';
import { inspect } from 'util';
import { array_wrap } from '../../../node/array-wrapper';
import { getAllPosts, orderPostBy } from '../../../node/cache-post';
import { write } from '../../../node/filemanager';
import { archiveMap, post_chunks } from '../../../parser/post/postMapper';
import { getLatestDateArray } from '../../../renderer/ejs/helper/date';
import { excerpt } from '../../../renderer/ejs/helper/excerpt';
import config, { isDev } from '../../../types/_config';

/**
 * get homepage archive properties
 * @returns
 */
export function getArchiveProperties(
  allPostChunks: ReturnType<typeof post_chunks>
) {
  // dump
  if (isDev)
    write(
      join(__dirname, 'tmp/getArchiveProperties/all_posts_chunks.log'),
      inspect(allPostChunks, true, 3)
    );

  const properties: archiveMap[] = [];

  for (let index = 0; index < allPostChunks.chunk.length; index++) {
    /** all posts of this page */
    const posts = allPostChunks.chunk[index];
    /** setup page.post.each */
    const mapped = array_wrap(posts);
    /** latest post date of this page */
    const latestUpdated = getLatestDateArray(
      mapped.map((post) =>
        typeof post.metadata.updated == 'string'
          ? post.metadata.updated
          : post.metadata.updated.toString()
      )
    );
    const latestPublished = getLatestDateArray(
      mapped.map((post) =>
        typeof post.metadata.date == 'string'
          ? post.metadata.date
          : post.metadata.date.toString()
      )
    );
    /** setup page metadata for renderer */
    const property: archiveMap = {
      metadata: {
        title: 'Archive Page ' + (index + 1),
        description: excerpt(config),
        date: latestPublished,
        updated: latestUpdated,
        type: 'archive'
      },
      posts: mapped,
      total: mapped.length,
      page_now: index,
      page_now_url: config.url + '/page/' + index,
      next: allPostChunks.chunk[index + 1] || null,
      page_next: index + 1,
      page_next_url: Array.isArray(allPostChunks.chunk[index + 1])
        ? config.url + '/page/' + (index + 1)
        : null,
      prev: allPostChunks.chunk[index - 1] || null,
      page_prev: index - 1 <= 0 ? null : index - 1,
      page_prev_url: Array.isArray(allPostChunks.chunk[index - 1])
        ? '/page/' + (index - 1)
        : '/page/'
    };
    properties.push(property);
  }

  if (isDev)
    write(
      join(__dirname, 'tmp/getArchiveProperties/archives.log'),
      inspect(properties, true, 3)
    );

  return properties;
}

export function getCategoryProperties() {
  const categories: {
    [key: string]: any;
  } = {};

  // iterate all posts to get categories
  const allPosts = getAllPosts();
  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i];
    if ('metadata' in post)
      if ('category' in post.metadata)
        post.metadata.category.flatMap((labelname) => {
          if (!categories[labelname]) categories[labelname] = [];
          categories[labelname].push(post);
        });
  }

  for (const catName in categories) {
    if (Object.prototype.hasOwnProperty.call(categories, catName)) {
      // sort category posts
      const sortedPosts = orderPostBy(
        categories[catName],
        config.index_generator.order_by
      );
      // transform chunk category posts
      const parseChunk = post_chunks(sortedPosts);
      const getProperies = getArchiveProperties(parseChunk);
      categories[catName] = getProperies;
      if (isDev)
        write(
          join(
            __dirname,
            'tmp/getArchiveProperties/categories',
            catName + '.log'
          ),
          inspect(getProperies, true, 3)
        );
    }
  }

  if (isDev)
    write(
      join(__dirname, 'tmp/getArchiveProperties/categories/index.log'),
      inspect(categories, true, 3)
    );

  return categories as {
    [key: string]: ReturnType<typeof post_chunks>;
  };
}

export function getHomepageProperties() {
  const allPosts = getAllPosts();
  return getArchiveProperties(post_chunks(allPosts));
}
