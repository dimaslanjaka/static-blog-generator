import chalk from 'chalk';
import { existsSync } from 'fs';
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
  if (!existsSync(deployDir)) mkdirSync(deployDir);
  if (!existsSync(join(deployDir, '.git'))) {
    console.log(
      logname,
      'init new git with current configuration',
      configDeploy
    );
    await git('init');
  }

  // setup merge on pull strategy
  await git('config', 'pull.rebase', 'false');
  // setup end of line LF
  // https://stackoverflow.com/a/13154031
  await git('config', 'core.autocrlf', 'false');

  // add CNAME if hostname settled
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
    await git(
      'config',
      'user.name',
      configDeploy['name'] || configDeploy['username']
    );
  }
  if ('email' in configDeploy) {
    console.log(logname, 'user email found, setting up...');
    await git('config', 'user.email', configDeploy['email']);
  }

  // compress git databases
  if (
    'gc' in configDeploy &&
    configDeploy['gc'] &&
    existsSync(join(deployDir, '.git'))
  ) {
    await git('gc', '--aggressive', '--prune');
  }

  try {
    await git('remote', 'add', 'origin', configDeploy['repo']);
  } catch (e1) {
    try {
      await git('remote', 'set-url', 'origin', configDeploy['repo']);
    } catch (e2) {
      if (e1) console.log('error add origin', e1);
      if (e2) console.log('error set-url origin', e2);
    }
  }

  // fetch all
  console.log(logname, 'fetch --all');
  await git('fetch', '--all');
  // reset latest origin https://stackoverflow.com/a/8888015/6404439
  console.log(logname, 'reset from latest origin/' + configDeploy['branch']);
  await git('reset', '--hard', 'origin/' + configDeploy['branch']);
  // checkout origin branch
  console.log(logname, 'checkout ' + configDeploy['branch']);
  await git('checkout', '-f', configDeploy['branch']);
  // pull origin
  await git('pull', 'origin', configDeploy['branch']);
  // check submodule
  const hasSubmodule = existsSync(join(deployDir, '.gitmodules'));
  if (hasSubmodule) {
    console.log(logname, 'submodule found, updating...');
    await git('submodule', 'update', '-i', '-r');
  }

  return copyGenerated().on('end', async () => {
    console.log(logname, 'processing files before deploy...');
    await beforeDeploy(post_generated_dir);
    console.log(logname, 'adding files...');
    await git('add', '-A');
    console.log(logname, 'comitting...');
    let msg = 'Update site';
    if (existsSync(join(process.cwd(), '.git'))) {
      msg += ' ' + (await getLatestCommitHash());
    }
    msg += '\ndate: ' + modMoment().format();
    await git('commit', '-m', msg);

    console.log(logname, `pushing ${configDeploy['branch']}...`);
    if (
      Object.hasOwnProperty.call(configDeploy, 'force') &&
      configDeploy['force'] === true
    ) {
      await git(
        'push',
        '-u',
        configDeploy['repo'],
        'origin',
        configDeploy['branch'],
        '--force'
      );
    } else {
      await git('push', '--set-upstream', 'origin', configDeploy['branch']);
    }

    console.log(logname, 'deploy merged with origin successful');

    done();
  });
};
