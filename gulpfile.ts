import Bluebird from 'bluebird';
import { existsSync } from 'fs';
import { gitHelper } from 'git-command-helper';
import { Submodule } from 'git-command-helper/dist/extract-submodule';
import gulp from 'gulp';
import dom from 'gulp-dom';
import { spawn } from 'hexo-util';
import moment from 'moment-timezone';
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
      ['*/*.html', '**/*.html', '**/**/*.html'].map((pattern) =>
        join(__dirname, config.public_dir, pattern)
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
              if (!matchHref) {
                a.setAttribute('rel', 'nofollow noopener noreferer');
              }
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

function deployConfig() {
  const deployDir = join(__dirname, '.deploy_git');
  const config = getConfig();
  const github = new gitHelper(deployDir);
  return { deployDir, config, github };
}

async function setupGit({ branch, url, baseDir }) {
  const github = new gitHelper(baseDir);
  await github.setremote(url);
  await github.setbranch(branch);
  return github;
}

gulp.task('copy-gen', async () => {
  const { deployDir, github, config } = deployConfig();
  const pull = async () => {
    await github.setremote(config.deploy.repo);
    if (!existsSync(deployDir)) await github.init();
    await github.setuser(config.deploy.username);
    await github.setemail(config.deploy.email);
    await github.reset(config.deploy.branch);

    if (github.submodule.hasSubmodule()) {
      await github.submodule.safeUpdate(true);
    }

    await github.pull(['--recurse-submodule']);
    await github.status().then((statuses) => {
      console.log(statuses);
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
  const commit = async () => {
    const now = moment().format('LLL');
    if (github.submodule.hasSubmodule()) {
      const info = await github.submodule.get();
      const commitSubmodule = async (sub: Submodule) => {
        const submodule = new gitHelper(sub.root);
        await submodule.addAndCommit('-A', `update ${sub.path} ${now}`);
        submodule.status().then(console.log);
      };
      while (info.length > 0) {
        try {
          commitSubmodule(info[0]);
        } catch {
          //
        }
        info.shift();
      }
    }
    await github.add('-A');
    await github.commit('update site ' + now);
  };
  await pull();
  await copyGen();
  await commit();
  await spawn('git', ['status'], { cwd: deployDir, stdio: 'inherit' });
});

import './deploy';
