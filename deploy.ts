import { existsSync } from 'fs';
import { gitHelper } from 'git-command-helper/src';
import gulp from 'gulp';
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
  await github.status().then((statuses) => {
    console.log(statuses);
    if (typeof done === 'function') done();
  });
}

gulp.task('status', status);
gulp.task('pull', pull);

function deployConfig() {
  const deployDir = join(__dirname, '.deploy_git');
  const config = getConfig();
  const github = new gitHelper(deployDir);
  return { deployDir, config, github };
}
