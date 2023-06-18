import frontMatter from 'front-matter';
import { readFileSync } from 'fs';
import { buildPost, parsePost, postMap } from 'hexo-post-parser';
import moment from 'moment-timezone';
import * as sbgUtils from 'sbg-utility';
import { Logger, writefile } from 'sbg-utility';
import { join, toUnix } from 'upath';

const processingUpdate = {};

/**
 * update metadata.updated post
 * @returns
 */
export async function updatePost(postPath: string, callback?: (result: boolean, postPath: string) => any) {
  // immediately return without callback
  if (processingUpdate[postPath]) return false;
  // add to index
  processingUpdate[postPath] = true;

  const config = sbgUtils.config.getConfig();
  const parse = await parsePost(postPath, {
    shortcodes: {
      youtube: true,
      css: true,
      include: true,
      link: true,
      now: true,
      script: true,
      text: true,
      codeblock: true
    },
    cache: false,
    config: config as any,
    formatDate: true,
    fix: true,
    sourceFile: postPath
  });

  if (parse && parse.metadata) {
    // update post updated date
    const oriUp = parse.metadata.updated;
    const oriPath = postPath;
    parse.metadata.updated = moment()
      .tz(config.timezone || 'UTC')
      .format();
    const post = frontMatter<Record<string, any>>(readFileSync(postPath, 'utf-8'));
    if ('updated' in post.attributes === false) {
      post.attributes.updated = parse.metadata.updated;
    }
    post.attributes.updated = parse.metadata.updated;
    post.attributes.date = parse.metadata.date;
    if ('modified' in parse.metadata) {
      post.attributes.modified = parse.metadata.modified;
    }

    // remove meta subtitle when description is same
    if (
      post.attributes.description &&
      post.attributes.subtitle &&
      post.attributes.description == post.attributes.subtitle
    ) {
      delete post.attributes.subtitle;
    }

    // prepare rebuild post
    const rBuild: postMap = {
      metadata: <any>post.attributes,
      body: post.body,
      rawbody: post.body,
      content: post.body,
      config: config as any
    };

    // update original source post after process ends
    const rebuild = buildPost(rBuild);
    //writefile(join(config.cwd, 'tmp/rebuild.md'), rebuild);
    Logger.log('write to', toUnix(oriPath).replace(toUnix(config.cwd), ''), oriUp, '->', post.attributes.updated);
    await writefile(oriPath, rebuild, { async: true }); // write original post

    const build = buildPost(parse);
    await writefile(postPath, build, { async: true });
  } else {
    Logger.log('cannot parse', postPath);
    writefile(join(config.cwd, 'tmp/errors', updatePost.name, 'cannot-parse.log'), postPath, { append: true });
  }

  const hasError = typeof (parse && parse.metadata) === 'undefined';
  if (typeof callback === 'function') callback(hasError, postPath);
  // remove from index
  delete processingUpdate[postPath];
  return hasError;
}
