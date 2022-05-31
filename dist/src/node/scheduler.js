"use strict";
/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindProcessExit = void 0;
var chalk_1 = __importDefault(require("chalk"));
var logname = chalk_1.default.hex('#f542e0')('[scheduler]');
var fns = [];
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
    Object.keys(fns).forEach(function (key) {
        if (scheduler.verbose)
            console.log(logname, "executing function key: ".concat(key));
        fns[key]();
    });
    if (options.cleanup && scheduler.verbose)
        console.log(logname, "clean exit(".concat(exitCode, ")"));
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
var functions = [];
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
var scheduler = /** @class */ (function () {
    function scheduler() {
        if (!scheduler.registered)
            scheduler.register();
    }
    /**
     * Register scheduler
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
                console.log(logname, 'executing', key);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL25vZGUvc2NoZWR1bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBcUI7QUFDckIsc0NBQXNDOzs7Ozs7QUFFdEMsZ0RBQTBCO0FBRTFCLElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFcEQsSUFBTSxHQUFHLEdBQWlELEVBQUUsQ0FBQztBQUM3RCxJQUFJLFNBQWtCLENBQUM7QUFDdkI7Ozs7R0FJRztBQUNILFNBQWdCLGVBQWUsQ0FBQyxHQUFXLEVBQUUsRUFBYztJQUN6RCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2QsZUFBZTtJQUNmLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGNBQWMsRUFBRSxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQztBQVBELDBDQU9DO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsV0FBVyxDQUFDLE9BQW9DLEVBQUUsUUFBYTtJQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7UUFDM0IsSUFBSSxTQUFTLENBQUMsT0FBTztZQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxrQ0FBMkIsR0FBRyxDQUFFLENBQUMsQ0FBQztRQUN6RCxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxPQUFPO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLHFCQUFjLFFBQVEsTUFBRyxDQUFDLENBQUM7SUFDbEQsSUFBSSxPQUFPLENBQUMsSUFBSTtRQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FB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