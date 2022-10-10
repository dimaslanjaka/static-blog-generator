import Bluebird from 'bluebird';
import { readFileSync, writeFile } from 'fs';
import gulp from 'gulp';
import { spawn } from 'hexo-util';
import { join } from 'upath';
import { deployConfig } from './deploy';
import './gulp.safelink';
import { sitemapCrawlerAsync } from './packages/sitemap-crawler/dist';

// commit current project
gulp.task('project-commit', (finish) => {
  const gitDirs = [
    join(__dirname, 'src-posts'),
    join(__dirname, 'source'),
    __dirname
  ];
  const commit = () => {
    if (!gitDirs.length) return finish();
    const gitDir = gitDirs[0];
    const opt = {
      cwd: gitDir,
      stdio: 'inherit'
    };
    return spawn('git', ['add', '-A'], <any>opt)
      .then(() =>
        spawn('git', ['commit', '-m', 'update ' + new Date()], <any>opt)
      )
      .catch((e) => {
        if (e instanceof Error) console.log(e.message, gitDir);
      })
      .finally(() => {
        gitDirs.shift();
        commit();
      });
  };
  return commit();
});

function getUntrackedSitemap() {
  return new Bluebird((resolve) => {
    const { deployDir } = deployConfig();
    const originfile = join(__dirname, 'public/sitemap.txt');
    const outfile = join(deployDir, 'sitemap.txt');
    let sitemaps = readFileSync(originfile, 'utf-8').split(/\r?\n/gm);
    sitemapCrawlerAsync('https://www.webmanajemen.com/chimeraland', {
      deep: 2
    }).then((results) => {
      sitemaps = Object.values(results)
        .flat(1)
        .concat(sitemaps)
        .filter(function (x, i, a) {
          return a.indexOf(x) === i && typeof x == 'string' && x.length > 0;
        })
        .sort(function (a, b) {
          return a === b ? 0 : a < b ? -1 : 1;
        });
      writeFile(outfile, sitemaps.join('\n'), resolve);
    });
  });
}

gulp.task('sitemap', getUntrackedSitemap);

const copyGen = () => {
  const { deployDir } = deployConfig();
  return new Bluebird((resolve) => {
    gulp
      .src(['**/**', '!**/.git*', '!**/tmp/**', '!**/node_modules/**'], {
        cwd: join(__dirname, 'public'),
        dot: true
      })
      .pipe(gulp.dest(deployDir))
      .on('error', console.trace)
      .once('end', () => getUntrackedSitemap().then(resolve));
  });
};

// copy public to .deploy_git
gulp.task('copy', copyGen);
gulp.task('deploy', gulp.series('pull', 'copy', 'safelink', 'commit', 'push'));
