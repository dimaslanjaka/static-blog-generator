import * as fs from 'fs-extra';
import gulp from 'gulp';
import { join } from 'path';
import './src';
import git, { getLatestCommitHash } from './src/node/git';
export { gulp };
export default gulp;

// deploy to https://github.com/dimaslanjaka/static-blog-generator.git#gh-pages
gulp.task('sbg:docs', async () => {
  const dest = join(__dirname, '.deploy_docs');
  const repo = 'https://github.com/dimaslanjaka/static-blog-generator.git';
  const spawnOpt: Parameters<typeof git>[0] = {
    cwd: dest,
    stdio: 'inherit',
    shell: true
  };
  //fs.rmSync(join(spawnOpt, '.git'), { recursive: true });
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

  await git(spawnOpt, 'fetch', '--all');
  if (gitInitialized) await git(spawnOpt, 'reset', '--hard', 'origin/gh-pages');
  await git(spawnOpt, 'fetch', 'origin');
  await git(spawnOpt, 'pull', repo, 'gh-pages:gh-pages');
  gulp
    .src([join(__dirname, 'src', '**/*.md'), 'readme.md'])
    .pipe(gulp.dest(dest))
    .on('end', async () => {
      await git(spawnOpt, 'add', '-A');
      const latestCommit = await getLatestCommitHash();
      await git(spawnOpt, 'commit', '-m', `update page from ${latestCommit}`);
      await git(spawnOpt, 'push', repo, 'gh-pages:gh-pages');
    });
});
