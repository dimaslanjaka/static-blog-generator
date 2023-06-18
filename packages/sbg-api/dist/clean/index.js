"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanGeneratedPosts = exports.cleanArchive = exports.cleanDb = void 0;
var gulp_1 = __importDefault(require("gulp"));
var cleanArchive_1 = __importDefault(require("./cleanArchive"));
exports.cleanArchive = cleanArchive_1.default;
var cleanDb_1 = require("./cleanDb");
Object.defineProperty(exports, "cleanDb", { enumerable: true, get: function () { return cleanDb_1.cleanDb; } });
var cleanGeneratedPosts_1 = require("./cleanGeneratedPosts");
Object.defineProperty(exports, "cleanGeneratedPosts", { enumerable: true, get: function () { return cleanGeneratedPosts_1.cleanGeneratedPosts; } });
gulp_1.default.task('clean:db', cleanDb_1.cleanDb);
gulp_1.default.task('clean:post', cleanGeneratedPosts_1.cleanGeneratedPosts);
gulp_1.default.task('clean:archive', cleanArchive_1.default);
gulp_1.default.task('clean:all', gulp_1.default.series('clean:db', 'clean:archive'));
//# sourceMappingURL=index.js.map