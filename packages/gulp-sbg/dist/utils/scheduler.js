"use strict";
/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindProcessExit = void 0;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const logname = ansi_colors_1.default.magentaBright('[scheduler]');
const fns = [];
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
exports.bindProcessExit = bindProcessExit;
/**
 * Handler function on process exit
 * @param options
 * @param exitCode
 */
function exitHandler(options, exitCode) {
    Object.keys(fns).forEach((key) => {
        if (scheduler.verbose)
            console.log(logname, `executing function key: ${key}`);
        fns[key]();
    });
    if (options.cleanup && scheduler.verbose)
        console.log(logname, `clean exit(${exitCode})`);
    if (options.exit)
        process.exit();
}
/**
 * Trigger Process Bindings
 */
function triggerProcess() {
    //do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }));
    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}
///// task queue manager
const functions = [];
/**
 * @example
 * ```js
 * bindProcessExit("scheduler_on_exit", function () {
 *    console.log("executing scheduled functions");
 *    scheduler.executeAll();
 * });
 * ```
 * or
 * ```js
 * scheduler.register();
 * ```
 */
class scheduler {
    constructor() {
        if (!scheduler.registered)
            scheduler.register();
    }
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
    static executeAll() {
        Object.keys(functions).forEach((key) => {
            if (scheduler.verbose)
                console.log(logname, 'executing', key);
            functions[key]();
        });
        scheduler.clearArray(functions);
    }
    /**
     * Clear Array
     * @param array
     */
    static clearArray(array) {
        while (array.length) {
            array.pop();
        }
    }
}
scheduler.verbose = true;
scheduler.registered = false;
scheduler.postponeCounter = 0;
exports.default = scheduler;
