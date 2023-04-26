"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getSourcePosts = void 0;
var glob = __importStar(require("glob"));
var sbg_utility_1 = require("sbg-utility");
var upath_1 = __importDefault(require("upath"));
var copy_1 = require("./copy");
/**
 * get all source markdown posts (_configyml.post_dir)
 * @returns
 */
function getSourcePosts(config) {
    return __awaiter(this, void 0, void 0, function () {
        var sourcePostDir, cache, cacheKey, results, matches, promises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!config)
                        config = (0, sbg_utility_1.getConfig)();
                    if (!config.cwd)
                        throw new Error('config.cwd is required');
                    if (!config.post_dir)
                        throw new Error('config.post_dir is required');
                    // default cache directory
                    if (!config.cacheDirectory)
                        config.cacheDirectory = upath_1.default.join(config.cwd, 'tmp');
                    sourcePostDir = upath_1.default.join(config.cwd, config.post_dir);
                    cache = new sbg_utility_1.persistentCache({ base: config.cacheDirectory, name: 'getSourcePosts' });
                    cacheKey = 'source-posts';
                    return [4 /*yield*/, cache.get(cacheKey, []).catch(function () { return []; })];
                case 1:
                    results = _a.sent();
                    if (!(results.length === 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, glob.glob('**/*.md', { cwd: sourcePostDir, realpath: true, absolute: true })];
                case 2:
                    matches = _a.sent();
                    promises = matches.map(function (p) {
                        return (0, copy_1.processSinglePost)(p, function (parsed) {
                            results.push(Object.assign(parsed, { full_source: p }));
                        });
                    });
                    // wait all promises to be resolved
                    return [4 /*yield*/, Promise.all(promises)];
                case 3:
                    // wait all promises to be resolved
                    _a.sent();
                    // apply cache
                    return [4 /*yield*/, cache.set(cacheKey, results)];
                case 4:
                    // apply cache
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, results];
            }
        });
    });
}
exports.getSourcePosts = getSourcePosts;
exports.default = getSourcePosts;
//# sourceMappingURL=get-source-posts.js.map