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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPost = void 0;
var yaml = __importStar(require("yaml"));
var parsePost_1 = require("./parsePost");
function buildPost(parsed) {
    if (!parsed) {
        throw new Error("'parsed' must be instance of `postMap` object, instead " +
            (parsed === null ? 'null' : typeof parsed));
    }
    if (parsed.metadata) {
        if ('metadata' in parsed.metadata) {
            delete parsed.metadata.metadata;
        }
        if ('config' in parsed.metadata) {
            delete parsed.metadata.config;
        }
        if ('body' in parsed.metadata) {
            delete parsed.metadata.body;
        }
        if ('content' in parsed.metadata) {
            delete parsed.metadata.content;
        }
        return "---\n".concat(yaml.stringify(parsed.metadata), "---\n\n").concat(parsed.body);
    }
    return parsed.body;
}
exports.buildPost = buildPost;
function _dummy() {
    return { parsePost: parsePost_1.parsePost };
}
exports.default = buildPost;
