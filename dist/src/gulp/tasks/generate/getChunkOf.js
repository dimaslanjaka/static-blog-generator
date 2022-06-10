"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChunkOf = void 0;
var path_1 = require("path");
var cache_1 = require("../../../node/cache");
var filemanager_1 = require("../../../node/filemanager");
var postMapper_1 = require("../../../parser/post/postMapper");
var _config_1 = require("../../../types/_config");
/**
 * generate tags archive
 * @param labelname specific tag name
 */
function getChunkOf(type, labelname) {
    var cacheInstance = type == 'tag'
        ? (0, cache_1.pcache)('tags')
        : type == 'category'
            ? (0, cache_1.pcache)('categories')
            : null;
    if (cacheInstance !== null) {
        var cacheKeys = cacheInstance.keysSync();
        if (!cacheKeys.length) {
            console.log('labels empty');
            return;
        }
        return getChunkOfLabels(cacheInstance, cacheKeys, labelname);
    }
}
exports.getChunkOf = getChunkOf;
/**
 * get post chunk of label
 * @param keys
 * @param labelname
 * @returns
 */
function getChunkOfLabels(instance, keys, labelname) {
    var result = {};
    for (var indexLabel = 0; indexLabel < keys.length; indexLabel++) {
        var tagname = keys[indexLabel];
        var tag_posts = instance.getSync(tagname);
        (0, filemanager_1.write)((0, path_1.join)(__dirname, 'tmp/getChunkOf/Labels/', indexLabel + '.json'), tag_posts);
        if (tag_posts.length === 0) {
            console.log("tag ".concat(tagname, " not have post"));
            continue;
        }
        // specific tag label otherwise skip
        if (typeof labelname == 'string' &&
            labelname.trim().length > 0 &&
            tagname.toLowerCase() !== labelname.toLowerCase()) {
            // console.log(logname, tagname, '!==', labelname);
            continue;
        }
        result[tagname] = (0, postMapper_1.post_chunks)(tag_posts);
        if (_config_1.isDev) {
            console.log(tagname, tag_posts.length, (0, path_1.join)(__dirname, 'tmp/tags', tagname + '.json'));
            (0, filemanager_1.write)((0, path_1.join)(__dirname, 'tmp/tags', tagname + '.json'), tag_posts.map(function (post) { return (0, postMapper_1.simplifyDump)(post); }));
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0Q2h1bmtPZi5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ndWxwL3Rhc2tzL2dlbmVyYXRlL2dldENodW5rT2YudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTRCO0FBQzVCLDZDQUE2QztBQUM3Qyx5REFBa0Q7QUFFbEQsOERBQTRFO0FBQzVFLGtEQUErQztBQUUvQzs7O0dBR0c7QUFDSCxTQUFnQixVQUFVLENBQ3hCLElBQXdCLEVBQ3hCLFNBQXlCO0lBRXpCLElBQU0sYUFBYSxHQUNqQixJQUFJLElBQUksS0FBSztRQUNYLENBQUMsQ0FBQyxJQUFBLGNBQU0sRUFBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQyxDQUFDLElBQUksSUFBSSxVQUFVO1lBQ3BCLENBQUMsQ0FBQyxJQUFBLGNBQU0sRUFBQyxZQUFZLENBQUM7WUFDdEIsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUVYLElBQUksYUFBYSxLQUFLLElBQUksRUFBRTtRQUMxQixJQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFM0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM1QixPQUFPO1NBQ1I7UUFFRCxPQUFPLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDOUQ7QUFDSCxDQUFDO0FBckJELGdDQXFCQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FDdkIsUUFBbUMsRUFDbkMsSUFBYyxFQUNkLFNBQWtCO0lBRWxCLElBQU0sTUFBTSxHQUFzRCxFQUFFLENBQUM7SUFDckUsS0FBSyxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEVBQUU7UUFDL0QsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pDLElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQWMsT0FBTyxDQUFDLENBQUM7UUFDekQsSUFBQSxtQkFBSyxFQUNILElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSx3QkFBd0IsRUFBRSxVQUFVLEdBQUcsT0FBTyxDQUFDLEVBQy9ELFNBQVMsQ0FDVixDQUFDO1FBQ0YsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQU8sT0FBTyxtQkFBZ0IsQ0FBQyxDQUFDO1lBQzVDLFNBQVM7U0FDVjtRQUVELG9DQUFvQztRQUNwQyxJQUNFLE9BQU8sU0FBUyxJQUFJLFFBQVE7WUFDNUIsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQzNCLE9BQU8sQ0FBQyxXQUFXLEVBQUUsS0FBSyxTQUFTLENBQUMsV0FBVyxFQUFFLEVBQ2pEO1lBQ0EsbURBQW1EO1lBQ25ELFNBQVM7U0FDVjtRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFBLHdCQUFXLEVBQUMsU0FBUyxDQUFDLENBQUM7UUFFekMsSUFBSSxlQUFLLEVBQUU7WUFDVCxPQUFPLENBQUMsR0FBRyxDQUNULE9BQU8sRUFDUCxTQUFTLENBQUMsTUFBTSxFQUNoQixJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FDL0MsQ0FBQztZQUNGLElBQUEsbUJBQUssRUFDSCxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLE9BQU8sR0FBRyxPQUFPLENBQUMsRUFDOUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLElBQUEseUJBQVksRUFBQyxJQUFJLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQyxDQUM1QyxDQUFDO1NBQ0g7S0FDRjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMifQ==