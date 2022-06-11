"use strict";
/* eslint-disable no-useless-escape */
Object.defineProperty(exports, "__esModule", { value: true });
exports.thumbnail = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var noimage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
/**
 * Thumbnail Helper
 * @description Get the thumbnail url from a post
 * @param {object} post
 * @example
 *     <%- thumbnail(post) %>
 */
function thumbnail(post) {
    var url = post.cover || post.thumbnail;
    if (!url && post.photos) {
        if (Array.isArray(post.photos))
            return post.photos[0];
    }
    if (!url) {
        var imgPattern = /\<img\s.*?\s?src\s*=\s*['|"]?([^\s'"]+).*?\>/gi;
        var result = imgPattern.exec(post.content);
        if (result && result.length > 1) {
            url = result[1];
        }
    }
    return url || noimage;
}
exports.thumbnail = thumbnail;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGh1bWJuYWlsLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3JlbmRlcmVyL2Vqcy9oZWxwZXIvdGh1bWJuYWlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBc0M7OztBQUl0QyxzRUFBc0U7QUFDdEUsSUFBTSxPQUFPLEdBQ1gsOEVBQThFLENBQUM7QUFFakY7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsU0FBUyxDQUFDLElBQXlCO0lBQ2pELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN2QyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDdkIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdkQ7SUFDRCxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ1IsSUFBTSxVQUFVLEdBQUcsZ0RBQWdELENBQUM7UUFDcEUsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDL0IsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQjtLQUNGO0lBQ0QsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDO0FBQ3hCLENBQUM7QUFiRCw4QkFhQyJ9