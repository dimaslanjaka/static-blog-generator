"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanGeneratedPosts = exports.cleanDb = exports.cleanArchive = void 0;
var cleanArchive_1 = __importDefault(require("./cleanArchive"));
exports.cleanArchive = cleanArchive_1.default;
var cleanDb_1 = require("./cleanDb");
Object.defineProperty(exports, "cleanDb", { enumerable: true, get: function () { return cleanDb_1.cleanDb; } });
var cleanGeneratedPosts_1 = require("./cleanGeneratedPosts");
Object.defineProperty(exports, "cleanGeneratedPosts", { enumerable: true, get: function () { return cleanGeneratedPosts_1.cleanGeneratedPosts; } });
//# sourceMappingURL=index.js.map