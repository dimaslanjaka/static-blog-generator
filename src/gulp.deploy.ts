import ansiColors from 'ansi-colors';
import Bluebird from 'bluebird';
import { existsSync } from 'fs';
import { gitHelper } from 'git-command-helper';
import gulp from 'gulp';
import moment from 'moment-timezone';
import { join, toUnix } from 'upath';
import './gulp.clean';
import { deployConfig, getConfig } from './gulp.config';
import './gulp.safelink';

/**
 * copy generated files (_config_yml.public_dir) to deploy dir (run after generated)
 * @returns
 */
export function copyGen() {
  const { deployDir } = deployConfig();
  const publicDir = join(process.cwd(), getConfig().public_dir);
  return gulp
    .src(['**/**', '!**/.git*', '!**/tmp/**', '!**/node_modules/**'], {
      cwd: publicDir,
      dot: true
    })
    .pipe(gulp.dest(deployDir))
    .on('error', console.trace);
}

/**
 * asynchronous copy generated files (_config_yml.public_dir) to deploy dir (run after generated)
 * @returns
 */
export function asyncCopyGen() {
  return new Bluebird(function (resolve) {
    copyGen().once('end', function () {
      resolve(null);
    });
  });
}

// copy public to .deploy_git
gulp.task('copy', copyGen);

function pull() {
  return new Promise((resolve) => {
    const { deployDir, github, config } = deployConfig();
    github
      .setremote(config.repo)
      .then(() => {
        return new Promise((resolveInit) => {
          if (!existsSync(deployDir)) {
            github.init().then(resolveInit);
          } else {
            resolveInit(null);
          }
        });
      })
      .then(() => github.setuser(config.username))
      .then(() => github.setemail(config.email))
      // reset repository to latest commit
      .then(() => github.reset(config.branch))
      // pull any changes inside submodule from their latest commit
      .then(() => {
        github.pull(['--recurse-submodule']).then(() => {
          if (github.submodule.hasSubmodule()) {
            console.log('safe update submodule');
            github.submodule.safeUpdate(true).then(resolve);
          } else {
            resolve(null);
          }
        });
      });
  });
}

function status(done?: gulp.TaskFunctionCallback) {
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

function commit() {
  const { github } = deployConfig();
  const now = moment().tz(getConfig().timezone).format('LLL');
  const commitRoot = function () {
    return new Promise((resolve) => {
      github.status().then((changes) => {
        console.log('changes', changes.length, toUnix(github.cwd).replace(toUnix(process.cwd()), ''));
        if (changes.length > 0) {
          github.add('-A').then(() => {
            github.commit('update site ' + now).then(() => {
              resolve(null);
            });
          });
        } else {
          resolve(null);
        }
      });
    });
  };
  const commitSubmodule = function () {
    return new Promise((resolve) => {
      if (github.submodule.hasSubmodule()) {
        const info = github.submodule.get();
        const commitSubmoduleChild = async (sub: typeof info[number]) => {
          const submodule = new gitHelper(sub.root);
          const items = await submodule.status();
          if (items.length > 0) {
            await submodule.add('-A');
            await submodule.commit(`update ${sub.path} ${now}`, 'am');
          }
        };
        const iterate = function () {
          return new Promise((resolveIt) => {
            // resolve directly when submodule items no made changes
            if (info.length === 0) return resolveIt(null);
            commitSubmoduleChild(info[0])
              .catch(noop)
              .finally(() => {
                info.shift();
                // re-iterate when submodule items not committed
                if (info.length > 0) return iterate();
                // resolves all
                resolveIt(null);
              });
          });
        };
        iterate().then(() => {
          resolve(null);
        });
      }
    });
  };

  return new Promise((resolve) => {
    commitSubmodule()
      .then(commitRoot)
      .then(() => resolve(null));
  });
}

function noop() {
  //
}

function push() {
  const { github } = deployConfig();
  const submodules = github.submodule.hasSubmodule() ? github.submodule.get() : [];
  const pushSubmodule = function (submodule: typeof submodules[number]) {
    const { url, branch, root } = submodule;
    if (!submodule.github) {
      submodule.github = new gitHelper(root);
    }
    const { github } = submodule;
    return new Promise((resolvePush) => {
      const setR = () => github.setremote(url);
      const setB = () => github.setbranch(branch);
      Promise.all([setR(), setB()]).then(() => {
        github.canPush().then((allowed) => {
          console.log(workspace(root), 'can push', allowed);
          if (allowed) {
            // push then resolve
            github.push(false, { stdio: 'pipe' }).then(resolvePush);
          } else {
            github.status().then((changes) => {
              if (changes.length > 0) {
                console.log('submodule', workspace(root), 'changes not staged');
                // resolve changes not staged
                resolvePush(null);
              } else {
                github.isUpToDate().then((updated) => {
                  console.log('submodule', workspace(root), 'updated', updated);
                  // resolve is up to date
                  resolvePush(null);
                });
              }
            });
          }
        });
      });
    });
  };
  const iterateSubmodule = function () {
    return new Promise((resolve) => {
      if (submodules.length === 0) {
        resolve(null);
      } else {
        const submodule = submodules.shift();
        if (submodule) {
          pushSubmodule(submodule).then(() => {
            if (submodules.length > 0) {
              iterateSubmodule().then(resolve);
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
      }
    });
  };
  return new Promise((resolve) => {
    iterateSubmodule()
      .then(function () {
        return new Promise((resolvePush) => {
          github.canPush().then((allowed) => {
            console.log(workspace(github.cwd), 'can push', allowed);
            if (allowed) {
              github.push().then(resolvePush);
            }
          });
        });
      })
      .then(resolve);
    //pushSubmodule(submodules[1]).then(resolve);
  });
}

gulp.task('push', push);
gulp.task('status', status);
gulp.task('commit', commit);
gulp.task('pull', pull);

/**
 * get relative path from workspace
 * @param str
 * @returns
 */
function workspace(str: string) {
  return toUnix(str).replace(toUnix(process.cwd()), '');
}

// deploy
gulp.task('deploy', gulp.series('pull', 'clean-archives', 'copy', 'safelink', 'commit', 'push'));
