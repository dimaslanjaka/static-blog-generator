"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nExcerpt = exports.excerpt = void 0;
/**
 * get excerpt of page
 * @param page page metadata object
 * @param length length of excerpt, default 200
 * @returns excerpt string
 * @example
 * // unescaped html
 * <%- excerpt(page) %>
 * // escaped html
 * <%= excerpt(page) %>
 */
function excerpt(page, length) {
    if (length === void 0) { length = 200; }
    var str;
    if (page.subtitle) {
        str = page.subtitle;
    }
    else if (page.description) {
        str = page.description;
    }
    else if (page.excerpt) {
        str = page.excerpt;
    }
    else if (page.title) {
        str = page.title;
    }
    if (str)
        return cleanString(str).substring(0, length);
}
exports.excerpt = excerpt;
/**
 * nullable excerpt
 * @param page
 * @returns
 */
function nExcerpt(page) {
    var try1 = excerpt(page);
    if (try1 == page.title)
        return null;
    return try1;
}
exports.nExcerpt = nExcerpt;
/**
 * get only text without special chars
 * * except spaces,.-_
 * * encoded html entities
 * @see {@link https://stackoverflow.com/a/6555220/6404439}
 * @param text
 * @returns
 */
function cleanString(text) {
    if (typeof text == 'string') {
        var rawStr = text.replace(/[^a-zA-Z0-9.,-_ ]/gm, '');
        var encodedStr = rawStr.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
            return '&#' + i.charCodeAt(0) + ';';
        });
        return encodedStr;
    }
    return text;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZXJwdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9yZW5kZXJlci9lanMvaGVscGVyL2V4Y2VycHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUE7Ozs7Ozs7Ozs7R0FVRztBQUNILFNBQWdCLE9BQU8sQ0FDckIsSUFBeUMsRUFDekMsTUFBWTtJQUFaLHVCQUFBLEVBQUEsWUFBWTtJQUVaLElBQUksR0FBVyxDQUFDO0lBQ2hCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNqQixHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztLQUNyQjtTQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtRQUMzQixHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUN4QjtTQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUN2QixHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNwQjtTQUFNLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNyQixHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNsQjtJQUNELElBQUksR0FBRztRQUFFLE9BQU8sV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQWZELDBCQWVDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLFFBQVEsQ0FBQyxJQUF5QztJQUNoRSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLElBQUksQ0FBQztJQUNwQyxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFKRCw0QkFJQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFTLFdBQVcsQ0FBQyxJQUFZO0lBQy9CLElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxFQUFFO1FBQzNCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxVQUFVLENBQUM7WUFDbkUsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFVBQVUsQ0FBQztLQUNuQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyJ9