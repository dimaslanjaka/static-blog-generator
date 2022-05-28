"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.author_link = exports.author_object = exports.author_email = exports.author_name = void 0;
var _config_1 = __importDefault(require("../../../types/_config"));
/**
 * get author name
 * @param page
 * @returns
 */
function author_name(page) {
    var author = page['author'];
    if (typeof author == 'string')
        return author;
    if (typeof author == 'object') {
        if (author['nick'])
            return author['nick'];
        if (author['name'])
            return author['name'];
    }
}
exports.author_name = author_name;
/**
 * get author email
 * @param page post metadata or config from _config.yml
 * @returns
 */
function author_email(page) {
    var author = page['author'];
    if (typeof author == 'object') {
        if (author['mail'])
            return author['mail'];
        if (author['email'])
            return author['email'];
    }
    // default email
    return 'noreply@blogger.com';
}
exports.author_email = author_email;
/**
 * transform author object
 * @param page
 * @returns
 */
function author_object(page) {
    return {
        name: String(author_name(page)),
        email: String(author_email(page)),
        link: String(author_link(page))
    };
}
exports.author_object = author_object;
/**
 * get author link
 * @param page
 * @returns
 */
function author_link(page) {
    var author = page['author'];
    if (typeof author == 'object') {
        if (author['link'])
            return author['link'];
    }
    if (_config_1.default.author) {
        if (_config_1.default.author.link)
            return _config_1.default.author.link;
    }
    return _config_1.default.url;
}
exports.author_link = author_link;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3JlbmRlcmVyL2Vqcy9oZWxwZXIvYXV0aG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLG1FQUE0QztBQUU1Qzs7OztHQUlHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLElBQXlDO0lBQ25FLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixJQUFJLE9BQU8sTUFBTSxJQUFJLFFBQVE7UUFBRSxPQUFPLE1BQU0sQ0FBQztJQUM3QyxJQUFJLE9BQU8sTUFBTSxJQUFJLFFBQVEsRUFBRTtRQUM3QixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFBRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFBRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMzQztBQUNILENBQUM7QUFQRCxrQ0FPQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixZQUFZLENBQUMsSUFBeUM7SUFDcEUsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTlCLElBQUksT0FBTyxNQUFNLElBQUksUUFBUSxFQUFFO1FBQzdCLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUFFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUFFLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzdDO0lBQ0QsZ0JBQWdCO0lBQ2hCLE9BQU8scUJBQXFCLENBQUM7QUFDL0IsQ0FBQztBQVRELG9DQVNDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLGFBQWEsQ0FBQyxJQUF5QztJQUNyRSxPQUFPO1FBQ0wsSUFBSSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsS0FBSyxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEMsQ0FBQztBQUNKLENBQUM7QUFORCxzQ0FNQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixXQUFXLENBQUMsSUFBeUM7SUFDbkUsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLElBQUksT0FBTyxNQUFNLElBQUksUUFBUSxFQUFFO1FBQzdCLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUFFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNDO0lBQ0QsSUFBSSxpQkFBTSxDQUFDLE1BQU0sRUFBRTtRQUNqQixJQUFJLGlCQUFNLENBQUMsTUFBTSxDQUFDLElBQUk7WUFBRSxPQUFPLGlCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztLQUNuRDtJQUNELE9BQU8saUJBQU0sQ0FBQyxHQUFHLENBQUM7QUFDcEIsQ0FBQztBQVRELGtDQVNDIn0=