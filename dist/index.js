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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gulpUtils = exports.setConfig = exports.getConfig = exports.deployConfig = exports.scheduler = exports.noop = exports.array_unique = exports.array_remove_empty = exports.array_random = exports.util = exports.updatePost = exports.copySinglePost = exports.copyAllPosts = exports.gulp = exports.commitProject = exports.standaloneRunner = exports.hexoGenerateSitemap = exports.generateSitemap = exports.autoSeo = exports.clean = exports.Application = void 0;
var gulp_cache_1 = __importDefault(require("./gulp-utils/gulp.cache"));
var gulp_debug_1 = __importStar(require("./gulp-utils/gulp.debug"));
var api_1 = require("./api");
Object.defineProperty(exports, "Application", { enumerable: true, get: function () { return __importDefault(api_1).default; } });
exports.clean = __importStar(require("./clean"));
var gulp_seo_1 = require("./gulp.seo");
Object.defineProperty(exports, "autoSeo", { enumerable: true, get: function () { return gulp_seo_1.taskSeo; } });
var gulp_sitemap_1 = require("./gulp.sitemap");
Object.defineProperty(exports, "generateSitemap", { enumerable: true, get: function () { return gulp_sitemap_1.generateSitemap; } });
Object.defineProperty(exports, "hexoGenerateSitemap", { enumerable: true, get: function () { return gulp_sitemap_1.hexoGenerateSitemap; } });
var gulp_standalone_1 = require("./gulp.standalone");
Object.defineProperty(exports, "standaloneRunner", { enumerable: true, get: function () { return __importDefault(gulp_standalone_1).default; } });
var gulpfile_1 = require("./gulpfile");
Object.defineProperty(exports, "commitProject", { enumerable: true, get: function () { return gulpfile_1.commitProject; } });
Object.defineProperty(exports, "gulp", { enumerable: true, get: function () { return __importDefault(gulpfile_1).default; } });
var copy_1 = require("./post/copy");
Object.defineProperty(exports, "copyAllPosts", { enumerable: true, get: function () { return copy_1.copyAllPosts; } });
Object.defineProperty(exports, "copySinglePost", { enumerable: true, get: function () { return copy_1.copySinglePost; } });
var update_1 = require("./post/update");
Object.defineProperty(exports, "updatePost", { enumerable: true, get: function () { return update_1.updatePost; } });
exports.util = __importStar(require("./utils"));
var array_1 = require("./utils/array");
Object.defineProperty(exports, "array_random", { enumerable: true, get: function () { return array_1.array_random; } });
Object.defineProperty(exports, "array_remove_empty", { enumerable: true, get: function () { return array_1.array_remove_empty; } });
Object.defineProperty(exports, "array_unique", { enumerable: true, get: function () { return array_1.array_unique; } });
var noop_1 = require("./utils/noop");
Object.defineProperty(exports, "noop", { enumerable: true, get: function () { return noop_1.noop; } });
var scheduler_1 = require("./utils/scheduler");
Object.defineProperty(exports, "scheduler", { enumerable: true, get: function () { return __importDefault(scheduler_1).default; } });
var _config_1 = require("./_config");
Object.defineProperty(exports, "deployConfig", { enumerable: true, get: function () { return _config_1.deployConfig; } });
Object.defineProperty(exports, "getConfig", { enumerable: true, get: function () { return _config_1.getConfig; } });
Object.defineProperty(exports, "setConfig", { enumerable: true, get: function () { return _config_1.setConfig; } });
exports.gulpUtils = {
    debug: gulp_debug_1.default,
    cached: gulp_cache_1.default,
    log: gulp_debug_1.gulpLog
};
