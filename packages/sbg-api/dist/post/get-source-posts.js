"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourcePosts = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var glob_1 = __importDefault(require("glob"));
var sbg_utility_1 = require("sbg-utility");
var upath_1 = __importDefault(require("upath"));
var copy_1 = require("./copy");
/**
 * get all source posts
 * @returns
 */
function getSourcePosts(config) {
    return new bluebird_1.default(function (resolve) {
        if (!config)
            config = (0, sbg_utility_1.getConfig)();
        var sourcePostDir = upath_1.default.join(config.cwd, config.post_dir);
        glob_1.default.glob('**/*.md', { cwd: sourcePostDir }).then(function (matches) {
            matches = matches.map(function (p) { return upath_1.default.join(sourcePostDir, p); });
            var results = [];
            matches.forEach(function (p) {
                return (0, copy_1.processSinglePost)(p, function (parsed) {
                    results.push(Object.assign(parsed, { full_source: p }));
                });
            });
            resolve(results);
        });
    });
}
exports.getSourcePosts = getSourcePosts;
exports.default = getSourcePosts;
//# sourceMappingURL=get-source-posts.js.map