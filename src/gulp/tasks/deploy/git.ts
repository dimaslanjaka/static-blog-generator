import chalk from 'chalk';
import { existsSync } from 'fs';
import { gitHelper } from 'git-command-helper';
import gulp from 'gulp';
import { TaskCallback } from 'undertaker';
import color from '../../../node/color';
import { join, mkdirSync, resolve, write } from '../../../node/filemanager';
import git, { getLatestCommitHash } from '../../../node/git';
import { modMoment } from '../../../renderer/helpers/date';
import config, { post_generated_dir } from '../../../types/_config';
import { beforeDeploy } from './beforeDeploy';

const deployDir = resolve(join(process.cwd(), '.deploy_git'));
const logname = chalk.magentaBright('[deploy][git]');

const copyGenerated = () => {
  return gulp
    .src(['**/**', '!**/.git*'], { cwd: post_generated_dir, dot: true })
    .pipe(gulp.dest(deployDir));
};

/**
 * GitHub Deployer
 * @param done
 * @returns
 */
export const deployerGit = async (done?: TaskCallback) => {
  // create deploy folder if not exist
  if (!existsSync(deployDir)) mkdirSync(deployDir);
  // process start
  const configDeploy = config.deploy;
  if (
    typeof configDeploy !== 'object' ||
    configDeploy === null ||
    'repo' in configDeploy === false
  ) {
    throw new Error('incorrect deploy config');
  }
  if ('branch' in configDeploy === false) {
    console.log(color.redBright('cannot push without branch'));
    return;
  }
  configDeploy['base'] = deployDir;
  // create deployment working dir if not exist
  if (!existsSync(deployDir)) mkdirSync(deployDir);

  const github = new gitHelper(deployDir);
  // initialize git if not exist
  if (!existsSync(join(deployDir, '.git'))) {
    console.log(
      logname,
      'init new git with current configuration',
      configDeploy
    );
    await github.init();
  }

  // add CNAME if exist
  if ('host' in configDeploy || 'hostname' in configDeploy) {
    const host = configDeploy['host'] || configDeploy['hostname'];
    if (typeof host === 'string') {
      const CNAME = join(deployDir, 'CNAME');
      write(CNAME, host);
    }
  }

  // resolve git username
  if ('name' in configDeploy || 'username' in configDeploy) {
    console.log(logname, 'user name found, setting up...');
    github.setuser(configDeploy['name'] || configDeploy['username']);
  }
  if ('email' in configDeploy) {
    console.log(logname, 'user email found, setting up...');
    github.setemail(configDeploy['email']);
  }

  // compress git databases
  if (
    'gc' in configDeploy &&
    configDeploy['gc'] &&
    existsSync(join(deployDir, '.git'))
  ) {
    await git('gc', '--aggressive', '--prune');
  }

  await github.setremote(configDeploy['repo']);

  // check submodule
  const hasSubmodule = github.submodule.hasSubmodule();

  // fetch all
  console.log(logname, 'fetching...');
  await github.fetch(['--all']);

  // reset latest origin https://stackoverflow.com/a/8888015/6404439
  console.log(logname, 'reset from latest origin/' + configDeploy['branch']);
  await github.reset(configDeploy['branch']);

  // checkout origin branch
  console.log(logname, 'checkout ' + configDeploy['branch']);
  await git('checkout', '-f', configDeploy['branch']);

  // pull origin with submodule and allow unrelated histories
  console.log(logname, 'pulling...');
  await github.pull(['--recurse-submodule', '--allow-unrelated-histories']);

  /*
  if (hasSubmodule) {
    console.log(logname, 'updating submodules...');
    await github.submodule.update();
  }
  */

  return copyGenerated().on('end', async () => {
    console.log(logname, 'processing files before deploy...');
    await beforeDeploy(post_generated_dir);

    // add
    console.log(logname, 'adding files...');
    if (hasSubmodule) {
      console.log(logname, 'adding submodules files...');
      await github.submodule.addAll('-A');
    }
    await github.add('-A');

    // commit
    console.log(logname, 'commiting...');
    let msg = 'Update site';
    if (existsSync(join(process.cwd(), '.git'))) {
      msg += ' ' + (await getLatestCommitHash());
    }
    msg += '\ndate: ' + modMoment().format();
    if (hasSubmodule) {
      console.log(logname, 'commiting submodules...');
      await github.submodule.commitAll(msg);
    }
    await github.commit(msg, '-am');

    // push
    console.log(logname, `pushing ${configDeploy['branch']}...`);
    if (
      Object.hasOwnProperty.call(configDeploy, 'force') &&
      configDeploy['force'] === true
    ) {
      /*await git(
        'push',
        '-u',
        configDeploy['repo'],
        'origin',
        configDeploy['branch'],
        '--force'
      );*/
    } else {
      //await git('push', '--set-upstream', 'origin', configDeploy['branch']);
    }

    if (hasSubmodule) {
      console.log(logname, 'pushing submodules...');
      //await git('submodule', 'foreach', 'git', 'push');
    }

    console.log(logname, 'deploy merged with origin successful');

    done();
  });
};
