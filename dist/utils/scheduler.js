"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindProcessExit = void 0;
var tslib_1 = require("tslib");
var ansi_colors_1 = tslib_1.__importDefault(require("ansi-colors"));
var _log = typeof hexo !== 'undefined' ? hexo.log : console;
var logname = ansi_colors_1.default.magentaBright('[scheduler]');
var fns = [];
var triggered;
function bindProcessExit(key, fn) {
    fns[key] = fn;
    if (!triggered) {
        triggered = true;
        triggerProcess();
    }
}
exports.bindProcessExit = bindProcessExit;
function exitHandler(options, exitCode) {
    Object.keys(fns).forEach(function (key) {
        if (scheduler.verbose)
            _log.info(logname, "executing function key: ".concat(key));
        fns[key]();
    });
    if (options.cleanup && scheduler.verbose)
        _log.info(logname, "clean exit(".concat(exitCode, ")"));
    if (options.exit)
        process.exit();
}
function triggerProcess() {
    process.on('exit', exitHandler.bind(null, { cleanup: true }));
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}
var functions = [];
var scheduler = (function () {
    function scheduler() {
        if (!scheduler.registered)
            scheduler.register();
    }
    scheduler.register = function () {
        if (scheduler.registered)
            return;
        scheduler.registered = true;
        bindProcessExit('scheduler_on_exit', function () {
            scheduler.executeAll();
        });
    };
    scheduler.add = function (key, value) {
        functions[key] = value;
        var self = this;
        new Promise(function (resolve) {
            setTimeout(function () {
                resolve(self.register());
            }, 3000);
        });
    };
    scheduler.postpone = function (key, value) {
        functions['postpone-' + key] = value;
        scheduler.postponeCounter += 1;
        if (scheduler.postponeCounter == 5) {
            scheduler.executeAll();
            scheduler.postponeCounter = 0;
        }
    };
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
    scheduler.executeAll = function () {
        Object.keys(functions).forEach(function (key) {
            if (scheduler.verbose)
                _log.info(logname, 'executing', key);
            functions[key]();
        });
        scheduler.clearArray(functions);
    };
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
