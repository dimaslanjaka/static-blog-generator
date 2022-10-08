import ansiColors from 'ansi-colors';
import { existsSync } from 'fs';
import { gitHelper } from 'git-command-helper/src';
import gulp from 'gulp';
import moment from 'moment-timezone';
import { getConfig } from 'static-blog-generator';
import { TaskCallback } from 'undertaker';
import { join } from 'upath';

async function pull(done?: TaskCallback) {
  const { deployDir, github, config } = deployConfig();
  await github.setremote(config.deploy.repo);
  if (!existsSync(deployDir)) await github.init();
  await github.setuser(config.deploy.username);
  await github.setemail(config.deploy.email);
  //await github.reset(config.deploy.branch);

  await github.pull(['--recurse-submodule']);
  if (github.submodule.hasSubmodule()) {
    console.log('safe update submodule');
    github.submodule.safeUpdate(true).then(() => {
      if (typeof done === 'function') done();
    });
  } else {
    if (typeof done === 'function') done();
  }
}

async function status(done?: TaskCallback) {
  const { github } = deployConfig();
  github.status().then((statuses) => {
    statuses.map((item) => {
      let str = '';

      switch (item.changes) {
        case 'deleted':
          str += ansiColors.red(item.changes);
          break;
        case 'added':
          str += ansiColors.green(item.changes);
          break;
        case 'modified':
          str += ansiColors.yellow(item.changes);
          break;
        case 'untracked':
          str += ansiColors.grey(item.changes);
          break;
        default:
          str += item.changes;
          break;
      }

      str += ' ';
      str += item.path;
      console.log(str);
    });

    if (typeof done === 'function') done();
  });
}

async function commit() {
  const { github, config } = deployConfig();
  const now = moment().tz(config.timezone).format('LLL');
  if (github.submodule.hasSubmodule()) {
    const info = github.submodule.get();
    const commitSubmodule = async (sub: typeof info[number]) => {
      const submodule = new gitHelper(sub.root);
      await submodule.addAndCommit('-A', `update ${sub.path} ${now}`, 'am');
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
}

gulp.task('status', status);
gulp.task('commit', commit);
gulp.task('pull', pull);

export function deployConfig() {
  const deployDir = join(__dirname, '.deploy_git');
  const config = getConfig();
  const github = new gitHelper(deployDir);
  return { deployDir, config, github };
}
