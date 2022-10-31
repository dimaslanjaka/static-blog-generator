"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPost = void 0;
const tslib_1 = require("tslib");
const yaml = tslib_1.__importStar(require("yaml"));
const parsePost_1 = require("./parsePost");
/**
 * Rebuild {@link parsePost} result to markdown post back
 * @param parsed parsed post return {@link parsePost}
 * @returns
 */
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
        return `---\n${yaml.stringify(parsed.metadata)}---\n\n${parsed.body}`;
    }
    return parsed.body;
}
exports.buildPost = buildPost;
function _dummy() {
    return { parsePost: parsePost_1.parsePost };
}
exports.default = buildPost;
//# sourceMappingURL=buildPost.js.map