"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestFromArrayDates = void 0;
var moment_1 = __importDefault(require("moment"));
function getCategoryTags(hexo) {
    var groups = ['categories', 'tags'];
    var locals = hexo.locals;
    var groupfilter = {
        tags: [],
        categories: []
    };
    if (!locals) {
        return groupfilter;
    }
    groups.map(function (group) {
        var lastModifiedObject = locals.get(group).map(function (items) {
            if (items.posts) {
                var archives = items;
                var posts = archives.posts;
                var latest = getLatestFromArrayDates(posts.map(function (post) {
                    var _a;
                    return ((_a = post.updated) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date();
                }));
                var permalink = new URL(hexo.config.url);
                permalink.pathname = archives.path;
                return {
                    permalink: permalink.toString(),
                    name: archives.name,
                    latest: (0, moment_1.default)(latest).format('YYYY-MM-DDTHH:mm:ssZ')
                };
            }
        });
        groupfilter[group] = lastModifiedObject;
    });
    return groupfilter;
}
/**
 * get latest date from array of date
 * @param arr
 * @returns
 */
function getLatestFromArrayDates(arr) {
    var dateMap = arr.map(function (e) {
        return e instanceof Date ? e : (0, moment_1.default)(e).toDate();
    });
    return new Date(Math.max.apply(null, dateMap.map(function (date) { return date.getTime(); })));
}
exports.getLatestFromArrayDates = getLatestFromArrayDates;
exports.default = getCategoryTags;
//# sourceMappingURL=archive.js.map