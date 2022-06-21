import chalk from 'chalk';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import gulp from 'gulp';
import { TaskCallback } from 'undertaker';
import color from '../../../node/color';
import { join, mkdirSync, resolve } from '../../../node/filemanager';
import { getLatestCommitHash } from '../../../node/git';
import { modMoment } from '../../../renderer/helpers/date';
import config, { post_generated_dir, root } from '../../../types/_config';
import { beforeDeploy } from './beforeDeploy';

const deployDir = resolve(join(root, '.deploy_git'));

/**
 * git command
 * @param args
 * @returns
 */
function git(...args: string[]) {
  return new Promise(
    (
      resolve: (args: { code: number; stdout: string; stderr: string }) => any,
      reject: (args: { args: string[]; err: Error }) => any
    ) => {
      const summon = spawn('git', args, {
        cwd: deployDir,
        stdio: 'inherit'
      });
      summon.on('close', function (code) {
        // Should probably be 'exit', not 'close'
        // *** Process completed
        return resolve({
          code: code,
          stdout: String(summon.stdout),
          stderr: String(summon.stderr)
        });
      });
      summon.on('error', function (err) {
        // *** Process creation failed
        return reject({ args: args, err: err });
      });
    }
  );
}
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
  if (!existsSync(deployDir)) mkdirSync(deployDir);
  const configDeploy = config.deploy;
  if (typeof configDeploy !== 'object' || configDeploy === null) {
    console.log('incorrect deploy config');
    return;
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

  // resolve git username
  if (configDeploy['name']) {
    await git('config', 'user.name', configDeploy['name']);
  } else if (configDeploy['username']) {
    await git('config', 'user.name', configDeploy['username']);
  }
  if (configDeploy['email']) {
    await git('config', 'user.email', configDeploy['email']);
  }

  // compress git databases
  //if (!init) await git('gc');

  try {
    await git('remote', 'add', 'origin', configDeploy['repo']);
  } catch {
    await git('remote', 'set-url', 'origin', configDeploy['repo']);
  }

  // fetch all
  await git('fetch', '--all');
  // setup merge on pull strategy
  await git('config', 'pull.rebase', 'false');
  // reset latest origin https://stackoverflow.com/a/8888015/6404439
  await git('reset', '--hard', 'origin/' + configDeploy['branch']);
  // checkout origin branch
  await git('checkout', '-f', configDeploy['branch']);
  // pull origin
  await git('pull', 'origin', configDeploy['branch']);
  // check submodule
  const hasSubmodule = existsSync(join(deployDir, '.gitmodules'));
  if (hasSubmodule) {
    await git('submodule', 'update', '-i', '-r');
  }

  return copyGenerated().on('end', async () => {
    await beforeDeploy(post_generated_dir);
    await git('add', '-A');
    let msg = 'Update site';
    if (existsSync(join(process.cwd(), '.git')))
      msg += ' ' + (await getLatestCommitHash());
    msg += '\ndate: ' + modMoment().format();
    await git('commit', '-m', msg);

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
