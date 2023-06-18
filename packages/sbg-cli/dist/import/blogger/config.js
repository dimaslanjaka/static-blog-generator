"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entriesDir = void 0;
const upath_1 = __importDefault(require("upath"));
exports.entriesDir = upath_1.default.join(process.cwd(), 'tmp/sbg-cli/entries');
//# sourceMappingURL=config.js.map