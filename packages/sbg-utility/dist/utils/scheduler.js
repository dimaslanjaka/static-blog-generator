"use strict";
/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
/* global hexo */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduler = exports.bindProcessExit = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
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
    return __awaiter(this, void 0, void 0, function () {
        var funcs, _loop_1, key;
        return __generator(this, function (_a) {
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
var scheduler = /** @class */ (function () {
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
exports.scheduler = scheduler;
exports.default = scheduler;
//# sourceMappingURL=scheduler.js.map