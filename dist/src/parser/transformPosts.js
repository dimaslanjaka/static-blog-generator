"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeListOf2Html = exports.validateParsed = exports.saveParsedPost = void 0;
var fs_1 = require("fs");
var color_1 = __importDefault(require("../node/color"));
var filemanager_1 = require("../node/filemanager");
var parsePost_1 = require("./post/parsePost");
/**
 * Save Parsed Hexo markdown post
 * @param parsed return {@link parsePost}
 * @param file file path to save
 */
function saveParsedPost(parsed, file) {
    if (!(0, fs_1.existsSync)((0, filemanager_1.dirname)(file)))
        (0, filemanager_1.mkdirSync)((0, filemanager_1.dirname)(file), { recursive: true });
    (0, filemanager_1.writeFileSync)(file, (0, parsePost_1.buildPost)(parsed));
}
exports.saveParsedPost = saveParsedPost;
/**
 * validate {@link parsePost}
 * @param parse
 * @returns
 */
var validateParsed = function (parse) {
    if (parse === null)
        return false;
    if (typeof parse === 'undefined')
        return false;
    if (parse && !parse.body) {
        console.log(color_1.default['Red Orange']('body of null:'));
        return false;
    }
    return true;
};
exports.validateParsed = validateParsed;
function nodeListOf2Html(nodes) {
    return Array.prototype.reduce.call(nodes, function (html, node) {
        return html + (node.outerHTML || node.nodeValue);
    }, '');
}
exports.nodeListOf2Html = nodeListOf2Html;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtUG9zdHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcGFyc2VyL3RyYW5zZm9ybVBvc3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHlCQUFnQztBQUNoQyx3REFBa0M7QUFDbEMsbURBQXdFO0FBQ3hFLDhDQUFzRDtBQUV0RDs7OztHQUlHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLE1BQWUsRUFBRSxJQUFZO0lBQzFELElBQUksQ0FBQyxJQUFBLGVBQVUsRUFBQyxJQUFBLHFCQUFPLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFBRSxJQUFBLHVCQUFTLEVBQUMsSUFBQSxxQkFBTyxFQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDOUUsSUFBQSwyQkFBYSxFQUFDLElBQUksRUFBRSxJQUFBLHFCQUFTLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBSEQsd0NBR0M7QUFFRDs7OztHQUlHO0FBQ0ksSUFBTSxjQUFjLEdBQUcsVUFBQyxLQUF1QjtJQUNwRCxJQUFJLEtBQUssS0FBSyxJQUFJO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDakMsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFDL0MsSUFBSSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDbEQsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyxDQUFDO0FBUlcsUUFBQSxjQUFjLGtCQVF6QjtBQUVGLFNBQWdCLGVBQWUsQ0FBQyxLQUEwQjtJQUN4RCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDaEMsS0FBSyxFQUNMLFVBQVUsSUFBSSxFQUFFLElBQUk7UUFDbEIsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuRCxDQUFDLEVBQ0QsRUFBRSxDQUNILENBQUM7QUFDSixDQUFDO0FBUkQsMENBUUMifQ==