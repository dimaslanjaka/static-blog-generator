import { TaskCallback } from 'undertaker';
import { join } from 'upath';
import color from '../../../node/color';
import { crossNormalize, globSrc, write } from '../../../node/filemanager';
import {
  buildPost,
  parsePost,
  SBGParsePostOptions
} from '../../../parser/post/parsePost';
import config, {
  argv,
  isDev,
  post_public_dir,
  post_source_dir
} from '../../../types/_config';
import './assets';

const logname = color.cyan('[copy][post]');
const paths =
  typeof argv['paths'] === 'string' ? argv['paths'].split(',') : null;

/**
 * copy posts from `src-posts` to config.source_dir {@link config.source_dir}
 * @description copy, parsing shortcodes, render html body, etc from src-posts to source_dir
 * @summary copy from src-posts to source/_posts
 * @param customPaths custom copy, only copy post with this key
 * @returns
 */
export function copyPosts(
  done: TaskCallback = null,
  customPaths: string | string[] = paths,
  options: SBGParsePostOptions = {}
) {
  const exclude = config.exclude.map((ePattern: string) =>
    ePattern.replace(/^!+/, '')
  );
  console.log(
    `${logname} cwd=${color.Mahogany(post_source_dir)} dest=${color[
      'Granny Smith Apple'
    ](post_public_dir)}`
  );
  let sources = globSrc('**/*.md', {
    cwd: post_source_dir,
    ignore: exclude
  })
    .filter((file) => file.endsWith('.md'))
    .map((file) => crossNormalize(join(post_source_dir, file)));
  if (customPaths) {
    sources = sources.filter((path) => {
      if (typeof customPaths === 'string') return path.includes(customPaths);
      // @fixme filter multiple custom paths
    });
  }

  return (
    sources
      .map(async (file) => {
        return {
          parse: await parsePost(file, null, options),
          file
        };
      })
      // fix post with space in path
      .each(async (obj) => {
        const parse = obj.parse;
        const path = obj.file;
        // @todo fix post with space in path
        if ('generator' in config) {
          if ('copy' in config.generator) {
            if ('posts' in config.generator.copy) {
              if ('space' in config.generator.copy.posts) {
                if (!config.generator.copy.posts.space) {
                  // @todo transform post with space to hypens format
                  const source = parse.metadata.source;
                  const url = parse.metadata.url;
                  const gulpPath = String(path);

                  if (/\s/.test(source)) {
                    const modParse = Object.assign({}, parse);
                    const newUrl =
                      config.url +
                      url.replace(config.url, '').replace(/\s|%20/g, '-');
                    const newSource = source.replace(/\s/g, '-');
                    const newGulpPath = gulpPath.replace(/\s/g, '-');
                    if (isDev) {
                      write(
                        join(
                          __dirname,
                          'tmp/posts-fix-hypens',
                          parse.metadata.title + '.log'
                        ),
                        [
                          { url, newUrl },
                          { source, newSource },
                          { gulpPath, newGulpPath }
                        ]
                      );
                    }
                    modParse.metadata.url = newUrl;
                    modParse.metadata.source = newSource;
                    const buildNewParse = buildPost(modParse);

                    // write new redirected post
                    write(
                      join(
                        post_public_dir,
                        newUrl.replace(config.url, '').replace(/.html$/, '.md')
                      ),
                      buildNewParse
                    );

                    if (isDev) {
                      write(
                        join(
                          __dirname,
                          'tmp/posts-fix-hypens',
                          parse.metadata.title + '-redirected.json'
                        ),
                        modParse
                      );
                      write(
                        join(
                          __dirname,
                          'tmp/posts-fix-hypens',
                          parse.metadata.title + '-redirected.md'
                        ),
                        buildNewParse
                      );
                    }

                    // apply redirect
                    parse.metadata.redirect_to = newUrl;
                    parse.metadata.permalink = parse.metadata.permalink.replace(
                      /\s|%20/g,
                      '-'
                    );
                    obj.parse = parse;

                    if (isDev) {
                      write(
                        join(
                          __dirname,
                          'tmp/posts-fix-hypens',
                          parse.metadata.title + '.json'
                        ),
                        await parsePost(null, buildPost(parse), {
                          sourceFile: String(path),
                          cache: false
                        })
                      );

                      write(
                        join(
                          __dirname,
                          'tmp/posts-fix-hypens',
                          parse.metadata.title + '.md'
                        ),
                        buildPost(parse)
                      );
                    }
                  }
                }
              }
            }
          }
        }
        return obj;
      })
      // save
      .each(async (obj) => {
        const saveTo = join(
          post_public_dir,
          obj.file.replace(post_source_dir, '')
        );
        return await write(saveTo, buildPost(obj.parse));
      })
      .then(() => {
        if (typeof done === 'function') done();
      })
      .catch((e) => {
        if (typeof done === 'function') done(e);
      })
  );
}

/**
 * @see {@link copyPosts}
 */
export const copy_posts = copyPosts;
