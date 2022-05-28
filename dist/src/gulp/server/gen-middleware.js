"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var upath_1 = require("upath");
var array_utils_1 = require("../../node/array-utils");
var cache_post_1 = require("../../node/cache-post");
var filemanager_1 = require("../../node/filemanager");
var _config_1 = __importDefault(require("../../types/_config"));
// middleware generator
var cats = [], tags = [];
try {
    (0, cache_post_1.getAllPosts)().forEach(function (post) {
        (0, array_utils_1.arrayAddAll)(cats, post.metadata.category);
        (0, array_utils_1.arrayAddAll)(tags, post.metadata.tags);
    });
}
catch (error) {
    //
}
var map_tags = (0, array_utils_1.array_unique)((0, array_utils_1.removeEmpties)(tags))
    .map(function (tag) {
    return '/' + _config_1.default.tag_dir + '/' + tag;
})
    .sort(function (a, b) {
    return a === b ? 0 : a < b ? -1 : 1;
});
var map_cats = (0, array_utils_1.array_unique)((0, array_utils_1.removeEmpties)(cats))
    .map(function (tag) {
    return '/' + _config_1.default.category_dir + '/' + tag;
})
    .sort(function (a, b) {
    return a === b ? 0 : a < b ? -1 : 1;
});
(0, filemanager_1.write)((0, upath_1.join)(__dirname, 'routes.json'), {
    tag: map_tags,
    category: map_cats
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuLW1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC9zZXJ2ZXIvZ2VuLW1pZGRsZXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrQkFBNkI7QUFDN0Isc0RBSWdDO0FBQ2hDLG9EQUFvRDtBQUNwRCxzREFBK0M7QUFDL0MsZ0VBQXlDO0FBRXpDLHVCQUF1QjtBQUN2QixJQUFNLElBQUksR0FBYSxFQUFFLEVBQ3ZCLElBQUksR0FBYSxFQUFFLENBQUM7QUFDdEIsSUFBSTtJQUNGLElBQUEsd0JBQVcsR0FBRSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7UUFDekIsSUFBQSx5QkFBVyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLElBQUEseUJBQVcsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztDQUNKO0FBQUMsT0FBTyxLQUFLLEVBQUU7SUFDZCxFQUFFO0NBQ0g7QUFDRCxJQUFNLFFBQVEsR0FBRyxJQUFBLDBCQUFZLEVBQUMsSUFBQSwyQkFBYSxFQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9DLEdBQUcsQ0FBQyxVQUFDLEdBQUc7SUFDUCxPQUFPLEdBQUcsR0FBRyxpQkFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQzFDLENBQUMsQ0FBQztLQUNELElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO0lBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsSUFBTSxRQUFRLEdBQUcsSUFBQSwwQkFBWSxFQUFDLElBQUEsMkJBQWEsRUFBQyxJQUFJLENBQUMsQ0FBQztLQUMvQyxHQUFHLENBQUMsVUFBQyxHQUFHO0lBQ1AsT0FBTyxHQUFHLEdBQUcsaUJBQU0sQ0FBQyxZQUFZLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUMvQyxDQUFDLENBQUM7S0FDRCxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztJQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUMsQ0FBQztBQUVMLElBQUEsbUJBQUssRUFBQyxJQUFBLFlBQUksRUFBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLEVBQUU7SUFDcEMsR0FBRyxFQUFFLFFBQVE7SUFDYixRQUFRLEVBQUUsUUFBUTtDQUNuQixDQUFDLENBQUMifQ==