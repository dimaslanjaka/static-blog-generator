"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = exports.tags = void 0;
var filemanager_1 = require("../../../node/filemanager");
var _config_1 = __importDefault(require("../../../types/_config"));
var tag_dir = _config_1.default.tag_dir;
var cat_dir = _config_1.default.category_dir;
var homepage = new URL(_config_1.default.url);
/**
 * list tag of page
 * @param page page object
 * @returns array of tags
 * @example
 * ```html
 * <% tags(page).forEach(tag => { %>
 * <!-- full url -->
 * tag url: <%- tag.url %>
 * <!-- label name -->
 * tag name: <%- tag.name %>
 * <!-- just pathname without base url -->
 * tag pathname: <%- tag.pathname %>
 * <% }) %>
 * ```
 */
function tags(page) {
    var result = [];
    var target = page.tags || [];
    if (page.metadata)
        target = page.metadata.tags;
    target.forEach(function (tag) {
        homepage.pathname = (0, filemanager_1.join)(tag_dir, tag);
        result.push({
            name: tag,
            path: homepage.pathname,
            url: homepage.toString()
        });
    });
    return result;
}
exports.tags = tags;
/**
 * extract categories from page
 * @param page
 * @returns array of object same as {@link tags}
 * @see {@link tags}
 */
function categories(page) {
    var result = [];
    var target = page.category || page.metadata.category || [];
    target.forEach(function (tag) {
        homepage.pathname = (0, filemanager_1.join)(cat_dir, tag);
        result.push({
            name: tag,
            path: homepage.pathname,
            url: homepage.toString()
        });
    });
    return result;
}
exports.categories = categories;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFiZWxzLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3JlbmRlcmVyL2Vqcy9oZWxwZXIvbGFiZWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHlEQUFpRDtBQUVqRCxtRUFBNEM7QUFDNUMsSUFBTSxPQUFPLEdBQUcsaUJBQU0sQ0FBQyxPQUFPLENBQUM7QUFDL0IsSUFBTSxPQUFPLEdBQUcsaUJBQU0sQ0FBQyxZQUFZLENBQUM7QUFnQnBDLElBQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFckM7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsU0FBZ0IsSUFBSSxDQUFDLElBQWE7SUFDaEMsSUFBTSxNQUFNLEdBQVksRUFBRSxDQUFDO0lBQzNCLElBQUksTUFBTSxHQUFhLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ3ZDLElBQUksSUFBSSxDQUFDLFFBQVE7UUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQVc7UUFDekIsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFBLGtCQUFJLEVBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDVixJQUFJLEVBQUUsR0FBRztZQUNULElBQUksRUFBRSxRQUFRLENBQUMsUUFBUTtZQUN2QixHQUFHLEVBQUUsUUFBUSxDQUFDLFFBQVEsRUFBRTtTQUN6QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFiRCxvQkFhQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFDLElBQWE7SUFDdEMsSUFBTSxNQUFNLEdBQVksRUFBRSxDQUFDO0lBQzNCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0lBQzdELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFXO1FBQ3pCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBQSxrQkFBSSxFQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ1YsSUFBSSxFQUFFLEdBQUc7WUFDVCxJQUFJLEVBQUUsUUFBUSxDQUFDLFFBQVE7WUFDdkIsR0FBRyxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7U0FDekIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBWkQsZ0NBWUMifQ==