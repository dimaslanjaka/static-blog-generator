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
function getSourcePosts() {
    return new bluebird_1.default(function (resolve) {
        var config = (0, sbg_utility_1.getConfig)();
        var sourcePostDir = upath_1.default.join(config.cwd, config.post_dir);
        (0, glob_1.default)('**/*.md', { cwd: sourcePostDir }, function (_err, matches) {
            if (!_err) {
                matches = matches.map(function (p) { return upath_1.default.join(sourcePostDir, p); });
                var results_1 = [];
                matches.forEach(function (p) {
                    return (0, copy_1.processSinglePost)(p, function (parsed) {
                        results_1.push(Object.assign(parsed, { full_source: p }));
                    });
                });
                resolve(results_1);
            }
        });
    });
}
exports.getSourcePosts = getSourcePosts;
exports.default = getSourcePosts;
//# sourceMappingURL=get-source-posts.js.map