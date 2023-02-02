"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gulpLog = exports.gulpDebug = exports.gulpCached = void 0;
var gulp_cache_1 = require("./gulp.cache");
Object.defineProperty(exports, "gulpCached", { enumerable: true, get: function () { return __importDefault(gulp_cache_1).default; } });
var gulp_debug_1 = require("./gulp.debug");
Object.defineProperty(exports, "gulpDebug", { enumerable: true, get: function () { return __importDefault(gulp_debug_1).default; } });
Object.defineProperty(exports, "gulpLog", { enumerable: true, get: function () { return gulp_debug_1.gulpLog; } });
//
//# sourceMappingURL=index.js.map