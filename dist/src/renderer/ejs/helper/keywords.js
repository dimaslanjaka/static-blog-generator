"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyword = exports.keywords = void 0;
var array_utils_1 = require("../../../node/array-utils");
function keywords(page) {
    var kw = [];
    if (Array.isArray(page.tags) && page.tags.length > 0)
        page.tags.forEach(function (i) { return kw.push(i); });
    if (Array.isArray(page.category) && page.category.length > 0)
        page.category.forEach(function (i) { return kw.push(i); });
    if (page.title) {
        (0, array_utils_1.uniqueStringArray)(page.title.replace(/[^\w\s]/gi, '').split(/\s+/))
            .map(function (s) { return s.trim(); })
            .forEach(function (i) { return kw.push(i); });
    }
    kw = (0, array_utils_1.uniqueStringArray)(kw);
    return kw.join(',');
}
exports.keywords = keywords;
var keyword = function (s) { return keywords(s); };
exports.keyword = keyword;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5d29yZHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcmVuZGVyZXIvZWpzL2hlbHBlci9rZXl3b3Jkcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0VBQXNFOzs7QUFFdEUseURBQThEO0FBRzlELFNBQWdCLFFBQVEsQ0FBQyxJQUF5QjtJQUNoRCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDWixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFWLENBQVUsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQVYsQ0FBVSxDQUFDLENBQUM7SUFDM0MsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ2QsSUFBQSwrQkFBaUIsRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2hFLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBUixDQUFRLENBQUM7YUFDcEIsT0FBTyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBVixDQUFVLENBQUMsQ0FBQztLQUMvQjtJQUNELEVBQUUsR0FBRyxJQUFBLCtCQUFpQixFQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBYkQsNEJBYUM7QUFFTSxJQUFNLE9BQU8sR0FBRyxVQUFDLENBQUMsSUFBSyxPQUFBLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBWCxDQUFXLENBQUM7QUFBN0IsUUFBQSxPQUFPLFdBQXNCIn0=