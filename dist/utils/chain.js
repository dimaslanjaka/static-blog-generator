"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chain = void 0;
var tslib_1 = require("tslib");
var stream_1 = tslib_1.__importDefault(require("stream"));
var logger_1 = tslib_1.__importDefault(require("./logger"));
function chain(schedule) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var run, instance;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    run = function (instance) {
                        return new Promise(function (resolve) {
                            var _a;
                            if ((_a = instance.opt) === null || _a === void 0 ? void 0 : _a.before) {
                                instance.opt.before();
                            }
                            var obj = instance.callback();
                            if (isReadableStream(obj) && obj instanceof stream_1.default.Stream) {
                                return obj.once('end', function () {
                                    var _a;
                                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    if (!((_a = instance.opt) === null || _a === void 0 ? void 0 : _a.after)) return [3, 2];
                                                    return [4, instance.opt.after()];
                                                case 1:
                                                    _b.sent();
                                                    return [2, resolve(this)];
                                                case 2: return [2, resolve(this)];
                                            }
                                        });
                                    });
                                });
                            }
                            else if (obj instanceof stream_1.default.Writable) {
                                logger_1.default.log('writable stream');
                            }
                            else if (isPromise(obj)) {
                                return obj.then(function () {
                                    var _a;
                                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    if (!((_a = instance.opt) === null || _a === void 0 ? void 0 : _a.after)) return [3, 2];
                                                    return [4, instance.opt.after()];
                                                case 1:
                                                    _b.sent();
                                                    return [2, resolve(this)];
                                                case 2: return [2, resolve(this)];
                                            }
                                        });
                                    });
                                });
                            }
                            else {
                                logger_1.default.log('cannot determine method instances');
                            }
                            resolve.bind(this)(chain.bind(this));
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!(schedule.length > 0)) return [3, 4];
                    instance = schedule.shift();
                    if (!(typeof instance !== 'undefined')) return [3, 3];
                    return [4, run(instance)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3, 1];
                case 4: return [2];
            }
        });
    });
}
exports.chain = chain;
function isPromise(p) {
    return ((p && String(Object.prototype.toString.call(p)).toLowerCase() === '[object promise]') ||
        (p &&
            typeof p.constructor === 'function' &&
            Function.prototype.toString.call(p.constructor).replace(/\(.*\)/, '()') ===
                Function.prototype.toString
                    .call(Function)
                    .replace('Function', 'Promise')
                    .replace(/\(.*\)/, '()')) ||
        (p && String(Function.prototype.toString.call(p.constructor)).startsWith('function Promise(')));
}
function isReadableStream(obj) {
    return obj instanceof stream_1.default.Stream && typeof (obj._read === 'function') && typeof (obj._readableState === 'object');
}
