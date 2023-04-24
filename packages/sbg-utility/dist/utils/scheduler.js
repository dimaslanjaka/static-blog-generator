"use strict";
/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
/* global hexo */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduler = exports.bindProcessExit = void 0;
var tslib_1 = require("tslib");
var ansi_colors_1 = tslib_1.__importDefault(require("ansi-colors"));
var chain_1 = require("./chain");
var _log = typeof hexo !== 'undefined' ? hexo.log : console;
var logname = ansi_colors_1.default.magentaBright('[scheduler]');
var fns = {};
var triggered;
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
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var funcs, _loop_1, key;
        return tslib_1.__generator(this, function (_a) {
            funcs = [];
            _loop_1 = function (key) {
                if (Object.prototype.hasOwnProperty.call(fns, key)) {
                    funcs.push({
                        callback: fns[key],
                        opt: {
                            before: function () {
                                if (scheduler.verbose)
                                    _log.info(logname, "executing function key: ".concat(key));
                            }
                        }
                    });
                }
            };
            for (key in fns) {
                _loop_1(key);
            }
            if (options.cleanup)
                (0, chain_1.chain)(funcs);
            if (options.cleanup && scheduler.verbose)
                _log.info(logname, "clean exit(".concat(exitCode, ")"));
            if (options.exit)
                process.exit();
            return [2 /*return*/];
        });
    });
}
/**
 * Trigger Process Bindings
 */
function triggerProcess() {
    // before exit
    //process.on('beforeExit', exitHandler.bind(null, { exit: true }));
    //do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }));
    // process.on('disconnect', exitHandler.bind(null, { exit: true }));
    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
    //process.on('SIGKILL', exitHandler.bind(null, { exit: true }));
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}
///// task queue manager
var functions = [];
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
var scheduler = exports.scheduler = /** @class */ (function () {
    function scheduler() {
        if (!scheduler.registered)
            scheduler.register();
    }
    /**
     * Register scheduler to process system
     */
    scheduler.register = function () {
        if (scheduler.registered)
            return;
        scheduler.registered = true;
        bindProcessExit('scheduler_on_exit', function () {
            scheduler.executeAll();
        });
    };
    /**
     * Add function with key to list
     * @param key existing key (duplicate) will be overwritten
     * @param value
     */
    scheduler.add = function (key, value) {
        functions[key] = value;
        var self = this;
        new Promise(function (resolve) {
            setTimeout(function () {
                resolve(self.register());
            }, 3000);
        });
    };
    /**
     * Add function to postpone, the functions will be executed every 5 items added
     */
    scheduler.postpone = function (key, value) {
        functions['postpone-' + key] = value;
        scheduler.postponeCounter += 1;
        if (scheduler.postponeCounter == 5) {
            scheduler.executeAll();
            scheduler.postponeCounter = 0;
        }
    };
    /**
     * Execute functon in key and delete
     * @param key
     */
    scheduler.execute = function (key, deleteAfter) {
        if (deleteAfter === void 0) { deleteAfter = true; }
        if (typeof functions[key] == 'function') {
            functions[key]();
            if (deleteAfter)
                delete functions[key];
        }
        else {
            if (scheduler.verbose)
                console.error("function with key: ".concat(key, " is not function"));
        }
    };
    /**
     * Execute all function lists
     */
    scheduler.executeAll = function () {
        Object.keys(functions).forEach(function (key) {
            if (scheduler.verbose)
                _log.info(logname, 'executing', key);
            functions[key]();
        });
        scheduler.clearArray(functions);
    };
    /**
     * Clear Array
     * @param array
     */
    scheduler.clearArray = function (array) {
        while (array.length) {
            array.pop();
        }
    };
    scheduler.verbose = true;
    scheduler.registered = false;
    scheduler.postponeCounter = 0;
    return scheduler;
}());
exports.default = scheduler;
//# sourceMappingURL=scheduler.js.map