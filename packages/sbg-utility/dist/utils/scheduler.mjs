import ansiColors from 'ansi-colors';
import Bluebird from 'bluebird';
import { chain } from './chain.mjs';

/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
//const _log = typeof hexo !== 'undefined' ? hexo.log : console;
const _log = console;
const logname = ansiColors.magentaBright('[scheduler]');
const fns = {};
let triggered;
/**
 * Bind functions to exit handler
 * @param key
 * @param fn
 */
function bindProcessExit(key, fn) {
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
async function exitHandler(options, exitCode = 0) {
    const funcs = [];
    for (const key in fns) {
        if (Object.prototype.hasOwnProperty.call(fns, key)) {
            funcs.push({
                callback: fns[key],
                opt: {
                    before: () => {
                        if (scheduler.verbose)
                            _log.info(logname, `executing function key: ${key}`);
                    }
                }
            });
        }
    }
    if (options?.cleanup)
        chain(funcs);
    if (options?.cleanup && scheduler.verbose)
        _log.info(logname, `clean exit(${exitCode})`);
    if (options?.exit)
        process.exit();
}
/**
 * Trigger Process Bindings
 */
function triggerProcess() {
    // before exit
    //process.on('beforeExit', exitHandler.bind(undefined, { exit: true }));
    //do something when app is closing
    process.on('exit', exitHandler.bind(undefined, { cleanup: true }));
    // process.on('disconnect', exitHandler.bind(undefined, { exit: true }));
    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(undefined, { exit: true }));
    //process.on('SIGKILL', exitHandler.bind(undefined, { exit: true }));
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(undefined, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(undefined, { exit: true }));
    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(undefined, { exit: true }));
}
///// task queue manager
const functions = {};
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
class scheduler {
    static verbose = true;
    constructor() {
        if (!scheduler.registered)
            scheduler.register();
    }
    static registered = false;
    /**
     * Register scheduler to process system
     */
    static register() {
        if (scheduler.registered)
            return;
        scheduler.registered = true;
        bindProcessExit('scheduler_on_exit', function () {
            scheduler.executeAll();
        });
    }
    /**
     * Add function with key to list
     * @param key existing key (duplicate) will be overwritten
     * @param value
     */
    static add(key, value) {
        functions[key] = value;
        const self = this;
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(self.register());
            }, 3000);
        });
    }
    static postponeCounter = 0;
    /**
     * Add function to postpone, the functions will be executed every 5 items added
     */
    static postpone(key, value) {
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
    static execute(key, deleteAfter = true) {
        if (typeof functions[key] == 'function') {
            functions[key]();
            if (deleteAfter)
                delete functions[key];
        }
        else {
            if (scheduler.verbose)
                console.error(`function with key: ${key} is not function`);
        }
    }
    /**
     * Execute all function lists
     */
    static async executeAll() {
        const keys = Object.keys(functions);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (scheduler.verbose)
                _log.info(logname, 'executing', key);
            await Bluebird.promisify(functions[key])();
        }
    }
}

export { bindProcessExit, scheduler as default, scheduler };
