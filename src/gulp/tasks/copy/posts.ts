import gulp from 'gulp';
import through2 from 'through2';
import { TaskCallback } from 'undertaker';
import { join } from 'upath';
import color from '../../../node/color';
import { write } from '../../../node/filemanager';
import { buildPost, parsePost } from '../../../parser/post/parsePost';
import config, {
  argv,
  isDev,
  post_public_dir,
  post_source_dir
} from '../../../types/_config';
import { determineDirname } from '../../utils';
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
export const copyPosts = (
  _done: TaskCallback = null,
  customPaths: string | string[] = paths,
  options: Partial<Parameters<typeof parsePost>[2]> = {}
) => {
  const exclude = config.exclude.map(
    (ePattern) => '!' + ePattern.replace(/^!+/, '')
  );
  console.log(
    `${logname} cwd=${color.Mahogany(post_source_dir)} dest=${color[
      'Granny Smith Apple'
    ](post_public_dir)}`
  );
  const run = gulp
    .src(['**/*.md', '!**/.git*', ...exclude], { cwd: post_source_dir })
    .pipe(
      through2.obj(async function (file, _encoding, next) {
        const path = file.path;
        if (typeof customPaths == 'string' && customPaths.length > 2) {
          // copy specific post path, otherwise drop this item
          if (!path.includes(customPaths)) return next();
        }
        const log = [logname, String(path)];
        const parse = await parsePost(
          String(path),
          String(file.contents),
          options
        );
        if (!parse) {
          console.log(`cannot parse ${String(path)}`, parse);
          // drop this item
          return next();
        }

        let buildThePost: string;

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
                    const modParse = parse;
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

                    parse.metadata.redirect = newUrl;

                    write(
                      join(
                        __dirname,
                        'tmp/posts-fix-hypens',
                        parse.metadata.title + '.json'
                      ),
                      parsePost(null, buildPost(parse), {
                        sourceFile: String(path)
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

        //write(tmp(parse.metadata.uuid, 'article.html'), bodyHtml);
        if (!buildThePost) buildThePost = buildPost(parse);
        if (typeof buildThePost == 'string') {
          //write(tmp(parse.metadata.uuid, 'article.md'), build);
          log.push(color.green('success'));
          file.contents = Buffer.from(buildThePost);
          //if (this) this.push(file);
          return next(null, file);
        } else {
          console.log(logname, color.Red('build not string'));
        }
        return next();
      })
    );
  return determineDirname(run).pipe(gulp.dest(post_public_dir));
};

/**
 * @see {@link copyPosts}
 */
export const copy_posts = copyPosts;
