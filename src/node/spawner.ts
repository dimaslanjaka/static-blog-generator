// noinspection DuplicatedCode

import {
  ChildProcess,
  ChildProcessWithoutNullStreams,
  SpawnOptions
} from 'child_process';
import spawn from 'cross-spawn';
import process from 'process';
import { Readable } from 'stream';
import scheduler from './scheduler';

class spawner {
  static children: ChildProcessWithoutNullStreams[] = [];
  private static onExit = false;

  /**
   * promises spawn
   * @param options
   * @param cmd
   * @param args
   * @returns
   * @example
   * spawner.promise({}, 'git', 'log', '-n', '1').then((res)=> console.log(res))
   */
  static promise(
    options: null | SpawnOptions = null,
    cmd: string,
    ...args: string[]
  ) {
    return new Promise(
      (
        resolve: (returnargs: {
          code: number;
          stdout: string[] | Readable;
          stderr: any;
        }) => any,
        reject: (returnargs: { args: string[]; err: Error }) => any
      ) => {
        if (options === null)
          options = {
            cwd: __dirname,
            stdio: 'inherit'
          };
        const stdouts: string[] = [];
        const stderrs: string[] = [];
        const child = spawn(cmd, args, options);
        // use event hooks to provide a callback to execute when data are available:
        if (child.stdout !== null && child.stdout !== undefined)
          child.stdout.on('data', function (data) {
            stdouts.push(data.toString().trim());
          });
        if (child.stderr !== null && child.stderr !== undefined)
          child.stderr.on('data', function (data) {
            stderrs.push(data.toString().trim());
          });
        child.on('close', function (code) {
          // Should probably be 'exit', not 'close'
          // *** Process completed
          return resolve({
            code: code,
            stdout: stdouts.length > 0 ? stdouts : child.stdout,
            stderr:
              stderrs.length > 0
                ? stderrs
                : stdouts.length === 0
                ? child.stderr
                : null
          });
        });
        child.on('error', function (err) {
          // *** Process creation failed
          return reject({ args: args, err: err });
        });
      }
    );
  }

  /**
   * Spawn Commands
   * @param command node
   * @param args ['index.js']
   * @param callback callback for children process
   */
  // eslint-disable-next-line no-unused-vars
  static spawn(
    command: string,
    args?: string[],
    opt: SpawnOptions = {},
    callback?: (path: ChildProcess) => any
  ) {
    const defaultOption: SpawnOptions = { stdio: 'pipe', detached: false };
    if (['npm', 'ts-node', 'tsc', 'npx', 'hexo'].includes(command)) {
      command = /^win/i.test(process.platform) ? `${command}.cmd` : command;
    }
    const child = spawn(command, args, Object.assign(defaultOption, opt));
    child.unref();

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
      process.stdout.write(data);
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
      process.stdout.write(data);
    });
    child.stdin.on('data', function (data) {
      process.stdout.write(data);
    });

    if (typeof callback == 'function') {
      callback(child);
    }
    spawner.children.push(child);
    console.log(`Child Process ${spawner.children.length}`);

    if (!this.onExit) {
      scheduler.add('spawner', spawner.children_kill);
      /*this.onExit = true;
      console.log('registering children killer');
      process.on('exit', function () {
        console.log('Finished', new Date().getTime());
        spawner.children_kill();
      });
      process.on('uncaughtException', spawner.children_kill);
      process.on('SIGINT', spawner.children_kill);
      process.on('SIGTERM', spawner.children_kill);
      process.on('SIGKILL', spawner.children_kill);*/
    }

    return child;
  }

  /**
   * Kill all ChildProcessWithoutNullStreams[]
   */
  static children_kill() {
    console.log(
      'killing',
      spawner.children.length,
      spawner.children.length > 1 ? 'child processes' : 'child process'
    );

    for (let i = 0; i < spawner.children.length; i++) {
      const child = spawner.children[i];
      if (typeof child != 'undefined') {
        child.kill();
        console.log(`Child ${child.pid} killed ${child.killed}`);
        delete spawner.children[i];
      }
    }
  }
}

export default spawner;
