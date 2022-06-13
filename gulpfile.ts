import Bluebird from 'bluebird';
import gulp from 'gulp';
import { join } from 'path';
import './src';
import { buildPost, parsePost } from './src';
import crawling from './src/crawling';
import { globSrc, read, write } from './src/node/filemanager';
import config from './src/types/_config';
crawling();
export { gulp };
export default gulp;

// deploy to https://github.com/dimaslanjaka/static-blog-generator.git#compiler-jekyll
gulp.task('sbg:docs', async (done) => {
  // process local files
  const destParse = join(__dirname, config.source_dir, '_posts');
  const parsed = await parsePost(
    join(__dirname, 'readme.md'),
    `
---
title: Readme Usages
webtitle: Static Blog Generator
date: 2022-06-10
updated: 2022-06-10
category: ['guide']
tags: ['guide']
---\n\n
    ` + read(join(__dirname, 'readme.md')).toString(),
    { cache: false }
  );
  await write(join(destParse, 'index.md'), buildPost(parsed));
  await Bluebird.all(
    globSrc('**/*.md', {
      cwd: join(__dirname, 'src'),
      ignore: ['**/tmp/**'],
      use: 'minimatch'
    })
  )
    .map((file) => join(__dirname, 'src', file))
    .map(async (file) => {
      return {
        parse: await parsePost(file, null, {
          cache: false
        }),
        source: file,
        build: null
      };
    })
    .map((post) => {
      post.build = buildPost(post.parse);
      return post;
    })
    .each((post) => {
      const saveTo = join(
        destParse,
        post.source.replace(join(__dirname, 'src'), '')
      );
      console.log(saveTo);
      if (post.build) write(saveTo, post.build).then(console.log);
    });
  return done();

  /*
  gulp
    .src(join(__dirname, 'readme.md'))
    .pipe(gulp.dest(join(dest, 'src-posts')));
  gulp
    .src()
    .pipe(gulp.dest(join(dest, 'src-posts', 'usages')))
    .on('end', async () => {
      await git({ cwd: dest }, 'add', '.');
      await git({ cwd: dest }, 'add', '-A');
      const latestCommit = await getLatestCommitHash(__dirname, {
        cwd: __dirname
      });
      const msg = `update page from ${latestCommit}`;
      await git(spawnOpt, 'commit', '-m', msg);
      await git(spawnOpt, 'push', 'origin', branch);
    });*/
});
