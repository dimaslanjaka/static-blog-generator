"use strict";
/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindProcessExit = void 0;
var chalk_1 = __importDefault(require("chalk"));
var logger = console;
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
                logger.error("function with key: ".concat(key, " is not function"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZWR1bGVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL25vZGUvc2NoZWR1bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBcUI7QUFDckIsc0NBQXNDOzs7Ozs7QUFFdEMsZ0RBQTBCO0FBRTFCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUN2QixJQUFNLE9BQU8sR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRXBELElBQU0sR0FBRyxHQUFpRCxFQUFFLENBQUM7QUFDN0QsSUFBSSxTQUFrQixDQUFDO0FBQ3ZCOzs7O0dBSUc7QUFDSCxTQUFnQixlQUFlLENBQUMsR0FBVyxFQUFFLEVBQWM7SUFDekQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNkLGVBQWU7SUFDZixJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsU0FBUyxHQUFHLElBQUksQ0FBQztRQUNqQixjQUFjLEVBQUUsQ0FBQztLQUNsQjtBQUNILENBQUM7QUFQRCwwQ0FPQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLFdBQVcsQ0FBQyxPQUFvQyxFQUFFLFFBQWE7SUFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1FBQzNCLElBQUksU0FBUyxDQUFDLE9BQU87WUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsa0NBQTJCLEdBQUcsQ0FBRSxDQUFDLENBQUM7UUFDekQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQztJQUNILElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTztRQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxxQkFBYyxRQUFRLE1BQUcsQ0FBQyxDQUFDO0lBQ2xELElBQUksT0FBTyxDQUFDLElB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