import Bluebird from 'bluebird';
import { existsSync } from 'fs';
import gulp from 'gulp';
import dom from 'gulp-dom';
import { spawn } from 'hexo-util';
import sf from 'safelinkify';
import { getConfig } from 'static-blog-generator';
import { join } from 'upath';

gulp.task('safelink', async () => {
  const config = getConfig();
  const configSafelink = Object.assign(
    { enable: false },
    config.external_link.safelink
  );
  const safelink = new sf.safelink({
    redirect: [config.external_link.safelink.redirect],
    password: config.external_link.safelink.password,
    type: config.external_link.safelink.type
  });
  const internal_links = [
    ...config.external_link.exclude,
    new URL(config.url).host,
    'www.webmanajemen.com',
    'https://github.com/dimaslanjaka',
    '/dimaslanjaka1',
    'dimaslanjaka.github.io'
  ];
  gulp
    .src(
      ['*/*.html', '**/*.html', '**/**/*.html'].map((path) =>
        join(__dirname, config.public_dir, path)
      )
    )
    .pipe(
      dom(function () {
        //https://github.com/trygve-lie/gulp-dom
        //this.querySelectorAll('body')[0].setAttribute('data-version', '1.0');
        const elements = Array.from(this.querySelectorAll('a'));
        if (configSafelink.enable) {
          for (let i = 0; i < elements.length; i++) {
            const a = elements[i];
            const href = String(a['href']).trim();
            if (new RegExp('^https?://').test(href)) {
              /**
               * match host
               */
              const matchHost = internal_links.includes(new URL(href).host);
              /**
               * match url
               */
              const matchHref = internal_links.includes(href);
              if (!matchHost && !matchHref) {
                const safelinkPath = safelink.encodeURL(href);
                if (
                  typeof safelinkPath == 'string' &&
                  safelinkPath.length > 0
                ) {
                  a.setAttribute('href', safelinkPath);
                }
              }
            }
          }
        }
      })
    )
    .pipe(gulp.dest(join(__dirname, config.public_dir)));
});

gulp.task('commit', (finish) => {
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

gulp.task('copy-gen', (done) => {
  const deployDir = join(__dirname, '.deploy_git');
  const pullCheck = () => {
    return new Bluebird((resolve) => {
      if (!existsSync(deployDir)) {
        spawn(
          'git',
          [
            'clone',
            'https://github.com/dimaslanjaka/dimaslanjaka.github.io.git',
            '.deploy_git'
          ],
          { cwd: __dirname, stdio: 'inherit' }
        )
          .catch(console.trace)
          .finally(() => resolve());
      } else {
        spawn('git', ['pull', 'origin', 'master'], {
          cwd: deployDir,
          stdio: 'inherit'
        })
          .catch(() =>
            spawn('git', ['reset', '--hard', 'origin/master'], {
              cwd: deployDir,
              stdio: 'inherit'
            })
          )
          .finally(() => resolve());
      }
    });
  };
  const copyGen = () => {
    return new Bluebird((resolve) => {
      gulp
        .src(['**/**', '!**/.git*'], {
          cwd: join(__dirname, 'public'),
          dot: true
        })
        .pipe(gulp.dest(deployDir))
        .on('error', console.trace)
        .once('end', () => resolve());
    });
  };
  pullCheck()
    .then(() => copyGen())
    .then(() => spawn('git', ['status'], { cwd: deployDir, stdio: 'inherit' }))
    .finally(() => done());
});
