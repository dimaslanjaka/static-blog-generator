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
var filemanager_1 = require("../../node/filemanager");
var date_1 = require("../../renderer/ejs/helper/date");
var _config_1 = __importStar(require("../../types/_config"));
/**
 * chunks iterator transform pages to partial page data
 * @param innerChunks partial pages
 * @param opt
 * @returns
 */
function postChunksIterator(innerChunks, opt) {
    var current_page = opt.current_page;
    var base = opt.base;
    var parentChunks = opt.parentChunks;
    var sitedata = opt.treeChunks.sitedata;
    var homepage = new URL(_config_1.default.url);
    /** previous page number */
    var page_prev = current_page - 1;
    if (!parentChunks[page_prev])
        page_prev = null;
    homepage.pathname = (0, filemanager_1.join)(base, page_prev);
    if (!page_prev)
        homepage.pathname = base;
    /** previous page permalink */
    var page_prev_url = homepage.pathname;
    homepage.pathname = (0, filemanager_1.join)(base, 'page', current_page);
    if (current_page === 0)
        homepage.pathname = base;
    /** current page permalink */
    var page_current_url = homepage.pathname;
    /** next page number */
    var page_next = current_page + 1;
    if (!parentChunks[page_next])
        page_next = null;
    homepage.pathname = (0, filemanager_1.join)(base, 'page', page_next);
    /** next page permalink */
    var page_next_url = page_next ? homepage.pathname : null;
    /** get latest modified time of posts */
    var latestUpdated = (0, date_1.getLatestDateArray)(innerChunks.map(function (post) { return post.updated.toString(); }));
    var result = {
        /** setup sitedata array as json */
        sitedata: JSON.stringify(sitedata),
        latestUpdated: latestUpdated,
        posts: innerChunks,
        total: parentChunks.length,
        page_now: current_page,
        page_prev: page_prev,
        page_prev_url: page_prev_url,
        page_current_url: page_current_url,
        page_next_url: page_next_url,
        page_next: page_next,
        perm_base: opt.base,
        perm_current: page_current_url
    };
    if (_config_1.default.verbose) {
        (0, filemanager_1.write)((0, _config_1.tmp)('generator', base, "".concat(current_page, ".log")), {
            page_prev: page_prev,
            page_prev_url: page_prev_url,
            page_current: current_page,
            page_current_url: page_current_url,
            page_next: page_next,
            page_next_url: page_next_url,
            total: parentChunks.length
        });
    }
    return result;
}
exports.default = postChunksIterator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdENodW5rc0l0ZXJhdG9yLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3BhcnNlci9wb3N0L3Bvc3RDaHVua3NJdGVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esc0RBQXFEO0FBQ3JELHVEQUFvRTtBQUNwRSw2REFBa0Q7QUF5QmxEOzs7OztHQUtHO0FBQ0gsU0FBd0Isa0JBQWtCLENBQ3hDLFdBRStCLEVBQy9CLEdBQThCO0lBRTlCLElBQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7SUFDdEMsSUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztJQUN0QixJQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO0lBQ3RDLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO0lBQ3pDLElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFckMsMkJBQTJCO0lBQzNCLElBQUksU0FBUyxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUM7SUFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7UUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQy9DLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBQSxrQkFBSSxFQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxQyxJQUFJLENBQUMsU0FBUztRQUFFLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3pDLDhCQUE4QjtJQUM5QixJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBRXhDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBQSxrQkFBSSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDckQsSUFBSSxZQUFZLEtBQUssQ0FBQztRQUFFLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ2pELDZCQUE2QjtJQUM3QixJQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFFM0MsdUJBQXVCO0lBQ3ZCLElBQUksU0FBUyxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUM7SUFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUM7UUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQy9DLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBQSxrQkFBSSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbEQsMEJBQTBCO0lBQzFCLElBQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRTNELHdDQUF3QztJQUN4QyxJQUFNLGFBQWEsR0FBRyxJQUFBLHlCQUFrQixFQUN0QyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBdkIsQ0FBdUIsQ0FBQyxDQUNuRCxDQUFDO0lBRUYsSUFBTSxNQUFNLEdBQUc7UUFDYixtQ0FBbUM7UUFDbkMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQ2xDLGFBQWEsZUFBQTtRQUNiLEtBQUssRUFBRSxXQUFXO1FBQ2xCLEtBQUssRUFBRSxZQUFZLENBQUMsTUFBTTtRQUMxQixRQUFRLEVBQUUsWUFBWTtRQUN0QixTQUFTLEVBQUUsU0FBUztRQUNwQixhQUFhLEVBQUUsYUFBYTtRQUM1QixnQkFBZ0IsRUFBRSxnQkFBZ0I7UUFDbEMsYUFBYSxFQUFFLGFBQWE7UUFDNUIsU0FBUyxFQUFFLFNBQVM7UUFDcEIsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJO1FBQ25CLFlBQVksRUFBRSxnQkFBZ0I7S0FDL0IsQ0FBQztJQUVGLElBQUksaUJBQU0sQ0FBQyxPQUFPLEVBQUU7UUFDbEIsSUFBQSxtQkFBSyxFQUFDLElBQUEsYUFBRyxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBRyxZQUFZLFNBQU0sQ0FBQyxFQUFFO1lBQ25ELFNBQVMsV0FBQTtZQUNULGFBQWEsZUFBQTtZQUNiLFlBQVksRUFBRSxZQUFZO1lBQzFCLGdCQUFnQixrQkFBQTtZQUNoQixTQUFTLFdBQUE7WUFDVCxhQUFhLGVBQUE7WUFDYixLQUFLLEVBQUUsWUFBWSxDQUFDLE1BQU07U0FDM0IsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBakVELHFDQWlFQyJ9