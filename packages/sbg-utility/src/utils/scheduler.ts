/** SCHEDULER JOB **/
/*** Postpone executing functions ***/

import color from 'ansi-colors';
import Bluebird from 'bluebird';
import { chain } from './chain';

//const _log = typeof hexo !== 'undefined' ? hexo.log : console;
const _log = console;

const logname = color.magentaBright('[scheduler]');

const fns: { [key: string]: (data?: string) => void } = {};
let triggered: boolean;
/**
 * Bind functions to exit handler
 * @param key
 * @param fn
 */
export function bindProcessExit(key: string, fn: (...args: any[]) => any) {
  fns[key] = fn;
  // trigger once
  if (!triggered) {
    triggered = true;
    triggerProcess();
  }
}

/**
 * Handler function on process exit
 * @param options
 * @param exitCode
 */
async function exitHandler(options?: { [key: string]: any; cleanup?: any; exit?: any }, exitCode: any = 0) {
  const funcs: Parameters<typeof chain>[0] = [];
  for (const key in fns) {
    if (Object.prototype.hasOwnProperty.call(fns, key)) {
      funcs.push({
        callback: fns[key],
        opt: {
          before: () => {
            if (scheduler.verbose) _log.info(logname, `executing function key: ${key}`);
          }
        }
      });
    }
  }
  if (options?.cleanup) chain(funcs);
  if (options?.cleanup && scheduler.verbose) _log.info(logname, `clean exit(${exitCode})`);
  if (options?.exit) process.exit();
}

/**
 * Trigger Process Bindings
 */
function triggerProcess() {
  // Ensure we don't add duplicate listeners
  if (process.listenerCount('exit') === 0) {
    process.on('exit', exitHandler.bind(undefined, { cleanup: true }));
  }

  if (process.listenerCount('SIGINT') === 0) {
    process.on('SIGINT', exitHandler.bind(undefined, { exit: true }));
  }

  if (process.listenerCount('SIGUSR1') === 0) {
    process.on('SIGUSR1', exitHandler.bind(undefined, { exit: true }));
  }

  if (process.listenerCount('SIGUSR2') === 0) {
    process.on('SIGUSR2', exitHandler.bind(undefined, { exit: true }));
  }

  if (process.listenerCount('uncaughtException') === 0) {
    process.on('uncaughtException', exitHandler.bind(undefined, { exit: true }));
  }
}

///// task queue manager

const functions: Record<string, (...args: any[]) => any> = {};

/**
 * @example
 * ```js
 * bindProcessExit("scheduler_on_exit", function () {
 *    _log.info("executing scheduled functions");
 *    scheduler.executeAll();
 * });
 * ```
 * or
 * ```js
 * scheduler.register();
 * ```
 */
export class scheduler {
  static verbose = true;
  constructor() {
    if (!scheduler.registered) scheduler.register();
  }
  private static registered = false;
  /**
   * Register scheduler to process system
   */
  static register(): void {
    if (scheduler.registered) return;
    scheduler.registered = true;
    bindProcessExit('scheduler_on_exit', () => scheduler.executeAll());
  }
  /**
   * Add function with key to list
   * @param key existing key (duplicate) will be overwritten
   * @param value
   */
  static add(key: string, value: () => any): void {
    functions[key] = value;
    // Register immediately instead of using an unhandled timeout
    scheduler.register();
  }

  private static postponeCounter = 0;

  /**
   * Add function to postpone, the functions will be executed every 5 items added
   */
  static postpone(key: string, value: () => any) {
    functions['postpone-' + key] = value;
    scheduler.postponeCounter += 1;
    if (scheduler.postponeCounter == 5) {
      scheduler.executeAll();
      scheduler.postponeCounter = 0;
    }
  }

  /**
   * Execute functon in key and delete
   * @param key
   */
  static execute(key: string, deleteAfter = true) {
    if (typeof functions[key] == 'function') {
      functions[key]();
      if (deleteAfter) delete functions[key];
    } else {
      if (scheduler.verbose) console.error(`function with key: ${key} is not function`);
    }
  }

  /**
   * Execute all function lists
   */
  static async executeAll() {
    const keys = Object.keys(functions);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (scheduler.verbose) _log.info(logname, 'executing', key);
      await Bluebird.promisify(functions[key])();
    }
  }

  /**
   * Clean up all event listeners and scheduled functions to prevent open handles
   */
  static cleanup(): void {
    // Clear all scheduled functions
    Object.keys(functions).forEach((key) => delete functions[key]);

    // Remove process event listeners
    process.removeAllListeners('exit');
    process.removeAllListeners('SIGINT');
    process.removeAllListeners('SIGUSR1');
    process.removeAllListeners('SIGUSR2');
    process.removeAllListeners('uncaughtException');

    // Reset state
    scheduler.registered = false;
    scheduler.postponeCounter = 0;
    triggered = false;

    // Clear exit handler functions
    Object.keys(fns).forEach((key) => delete fns[key]);
  }
}

export default scheduler;
