import Bluebird from 'bluebird';
import * as fs from 'fs-extra';
import gulp from 'gulp';
import { join } from 'path';
import './src';
import { buildPost, parsePost } from './src';
import crawling from './src/crawling';
import { globSrc, read, write } from './src/node/filemanager';
import git from './src/node/git';
import config from './src/types/_config';
crawling();
export { gulp };
export default gulp;

// deploy to https://github.com/dimaslanjaka/static-blog-generator.git#compiler-jekyll
gulp.task('sbg:docs', async (done) => {
  const dest = join(__dirname, 'public');
  const repo = 'https://github.com/dimaslanjaka/static-blog-generator.git';
  const branch = 'gh-pages';
  const spawnOpt: Parameters<typeof git>[0] = {
    cwd: dest,
    stdio: 'inherit',
    shell: true
  };
  //fs.rmSync(join(dest, '.git'), { recursive: true });
  if (!fs.existsSync(dest)) fs.mkdirSync(dest);
  const gitInitialized = fs.existsSync(join(dest, '.git'));
  if (!gitInitialized) {
    git(spawnOpt, 'init').then(() => {
      git(spawnOpt, 'remote', 'add', 'origin', repo);
    });
  } else {
    git(spawnOpt, 'remote', 'set-url', 'origin', repo);
  }

  await git(spawnOpt, 'config', 'user.email', 'dimaslanjaka@gmail.com');
  await git(spawnOpt, 'config', 'user.name', 'dimaslanjaka');

  if (gitInitialized) {
    // reset commit as latest origin branch
    await git({ cwd: dest }, 'reset', '--hard', 'origin/' + branch);
  }
  // fetch origin
  await git({ cwd: dest }, 'fetch', 'origin');
  // checkout origin branch
  await git({ cwd: dest }, 'checkout', branch);
  // setup merge on pull strategy
  await git({ cwd: dest }, 'config', 'pull.rebase', 'false');
  // pulling
  await git({ cwd: dest }, 'pull', 'origin', branch);
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
    .map((file) => {
      return {
        parse: parsePost(file, null, { cache: false }),
        source: file,
        build: null
      };
    })
    .map((post) => {
      post.build = buildPost(post.parse);
      return post;
    })
    .each((post) => {
      write(join(destParse, post.source), post.build);
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
