"use strict";
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
exports.chain = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var stream_1 = __importDefault(require("stream"));
var logger_1 = __importDefault(require("./logger"));
/**
 * Chainable function runner
 * @param schedule array of function objects
 */
function chain(schedule) {
    return __awaiter(this, void 0, void 0, function () {
        var run, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    run = function (instance) {
                        return new Promise(function (resolve) {
                            var _a;
                            var logname = ansi_colors_1.default.blueBright('chain') + '.' + ansi_colors_1.default.yellowBright('run');
                            if ((_a = instance.opt) === null || _a === void 0 ? void 0 : _a.before) {
                                instance.opt.before();
                            }
                            var obj = instance.callback.call && instance.callback.call(null);
                            if (isReadableStream(obj) && obj instanceof stream_1.default.Stream) {
                                // Logger.log('readable stream');
                                return obj.once('end', function () {
                                    var _a;
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    if (!((_a = instance.opt) === null || _a === void 0 ? void 0 : _a.after)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, instance.opt.after()];
                                                case 1:
                                                    _b.sent();
                                                    return [2 /*return*/, resolve(this)];
                                                case 2: return [2 /*return*/, resolve(this)];
                                            }
                                        });
                                    });
                                });
                            }
                            else if (obj instanceof stream_1.default.Writable) {
                                logger_1.default.log('writable stream');
                            }
                            else if (isPromise(obj)) {
                                //Logger.log('promises');
                                return obj.then(function () {
                                    var _a;
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    if (!((_a = instance.opt) === null || _a === void 0 ? void 0 : _a.after)) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, instance.opt.after()];
                                                case 1:
                                                    _b.sent();
                                                    return [2 /*return*/, resolve(this)];
                                                case 2: return [2 /*return*/, resolve(this)];
                                            }
                                        });
                                    });
                                });
                            }
                            else {
                                if (typeof instance.callback !== 'function') {
                                    logger_1.default.log(logname, 'cannot determine method instances');
                                }
                            }
                            resolve.bind(this)(chain.bind(this));
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!(schedule.length > 0)) return [3 /*break*/, 4];
                    instance = schedule.shift();
                    if (!(typeof instance !== 'undefined')) return [3 /*break*/, 3];
                    return [4 /*yield*/, run(instance)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.chain = chain;
/**
 * check object is Promises
 * @param p
 * @returns
 */
function isPromise(p) {
    return ((p && String(Object.prototype.toString.call(p)).toLowerCase() === '[object promise]') ||
        // check ES6 Promises
        (p &&
            typeof p.constructor === 'function' &&
            Function.prototype.toString.call(p.constructor).replace(/\(.*\)/, '()') ===
                Function.prototype.toString
                    .call(/*native object*/ Function)
                    .replace('Function', 'Promise') // replacing Identifier
                    .replace(/\(.*\)/, '()')) || // removing possible FormalParameterList
        // my own experiment
        (p && String(Function.prototype.toString.call(p.constructor)).startsWith('function Promise(')));
}
/**
 * check object is readable stream
 * @param obj
 * @returns
 */
function isReadableStream(obj) {
    return obj instanceof stream_1.default.Stream && typeof (obj._read === 'function') && typeof (obj._readableState === 'object');
}
//# sourceMappingURL=chain.js.map