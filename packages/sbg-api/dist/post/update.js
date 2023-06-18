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
exports.updatePost = void 0;
var front_matter_1 = __importDefault(require("front-matter"));
var fs_1 = require("fs");
var hexo_post_parser_1 = require("hexo-post-parser");
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var sbgUtils = __importStar(require("sbg-utility"));
var sbg_utility_1 = require("sbg-utility");
var upath_1 = require("upath");
var processingUpdate = {};
/**
 * update metadata.updated post
 * @returns
 */
function updatePost(postPath, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var config, parse, oriUp, oriPath, post, rBuild, rebuild, build, hasError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // immediately return without callback
                    if (processingUpdate[postPath])
                        return [2 /*return*/, false];
                    // add to index
                    processingUpdate[postPath] = true;
                    config = sbgUtils.config.getConfig();
                    return [4 /*yield*/, (0, hexo_post_parser_1.parsePost)(postPath, {
                            shortcodes: {
                                youtube: true,
                                css: true,
                                include: true,
                                link: true,
                                now: true,
                                script: true,
                                text: true,
                                codeblock: true
                            },
                            cache: false,
                            config: config,
                            formatDate: true,
                            fix: true,
                            sourceFile: postPath
                        })];
                case 1:
                    parse = _a.sent();
                    if (!(parse && parse.metadata)) return [3 /*break*/, 4];
                    oriUp = parse.metadata.updated;
                    oriPath = postPath;
                    parse.metadata.updated = (0, moment_timezone_1.default)()
                        .tz(config.timezone || 'UTC')
                        .format();
                    post = (0, front_matter_1.default)((0, fs_1.readFileSync)(postPath, 'utf-8'));
                    if ('updated' in post.attributes === false) {
                        post.attributes.updated = parse.metadata.updated;
                    }
                    post.attributes.updated = parse.metadata.updated;
                    post.attributes.date = parse.metadata.date;
                    if ('modified' in parse.metadata) {
                        post.attributes.modified = parse.metadata.modified;
                    }
                    // remove meta subtitle when description is same
                    if (post.attributes.description &&
                        post.attributes.subtitle &&
                        post.attributes.description == post.attributes.subtitle) {
                        delete post.attributes.subtitle;
                    }
                    rBuild = {
                        metadata: post.attributes,
                        body: post.body,
                        rawbody: post.body,
                        content: post.body,
                        config: config
                    };
                    rebuild = (0, hexo_post_parser_1.buildPost)(rBuild);
                    //writefile(join(config.cwd, 'tmp/rebuild.md'), rebuild);
                    sbg_utility_1.Logger.log('write to', (0, upath_1.toUnix)(oriPath).replace((0, upath_1.toUnix)(config.cwd), ''), oriUp, '->', post.attributes.updated);
                    return [4 /*yield*/, (0, sbg_utility_1.writefile)(oriPath, rebuild, { async: true })];
                case 2:
                    _a.sent(); // write original post
                    build = (0, hexo_post_parser_1.buildPost)(parse);
                    return [4 /*yield*/, (0, sbg_utility_1.writefile)(postPath, build, { async: true })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    sbg_utility_1.Logger.log('cannot parse', postPath);
                    (0, sbg_utility_1.writefile)((0, upath_1.join)(config.cwd, 'tmp/errors', updatePost.name, 'cannot-parse.log'), postPath, { append: true });
                    _a.label = 5;
                case 5:
                    hasError = typeof (parse && parse.metadata) === 'undefined';
                    if (typeof callback === 'function')
                        callback(hasError, postPath);
                    // remove from index
                    delete processingUpdate[postPath];
                    return [2 /*return*/, hasError];
            }
        });
    });
}
exports.updatePost = updatePost;
//# sourceMappingURL=update.js.map