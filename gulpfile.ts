import * as fs from 'fs-extra';
import gulp from 'gulp';
import { join } from 'path';
import './src';
import crawling from './src/crawling';
import git, { getLatestCommitHash } from './src/node/git';
crawling();
export { gulp };
export default gulp;

// deploy to https://github.com/dimaslanjaka/static-blog-generator.git#compiler-jekyll
gulp.task('sbg:docs', async () => {
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
  await git(spawnOpt, 'fetch', 'origin');
  // checkout origin branch
  await git({ cwd: dest }, 'checkout', branch);
  // setup merge on pull strategy
  await git({ cwd: dest }, 'config', 'pull.rebase', 'false');
  // pulling
  await git(spawnOpt, 'pull');
  // process local files
  gulp.src(join(__dirname, 'readme.md')).pipe(gulp.dest(dest));
  gulp
    .src([join(__dirname, 'src', '**/*.md'), '!**/tmp'])
    .pipe(gulp.dest(join(dest, 'usages')))
    .on('end', async () => {
      await git({ cwd: dest }, 'add', '.');
      await git({ cwd: dest }, 'add', '-A');
      const latestCommit = await getLatestCommitHash(__dirname);
      const msg = `update page from ${latestCommit}`;
      await git({ cwd: dest }, 'commit', '-m', msg);
      //await git(spawnOpt, 'push', 'origin', branch);
    });
});
