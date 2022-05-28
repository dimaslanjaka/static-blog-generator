"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var deepmerge_ts_1 = require("deepmerge-ts");
var upath_1 = require("upath");
var url_parse_1 = __importDefault(require("url-parse"));
var array_utils_1 = require("../node/array-utils");
/**
 * Automatically parse url with the query strings to object (nullable)
 * @param src url string
 * @returns object parsed {@link URLParsed} combined with partial properties from {@link urlParse}
 */
var urlParser = /** @class */ (function () {
    function urlParser(src) {
        this.result = this.parse(src);
    }
    urlParser.prototype.parse = function (src) {
        if (!src)
            return;
        this.resultStr = src;
        var parser = new url_parse_1.default(src);
        var searchObject = [];
        var queries = parser.query.replace(/^\?/, '').split('&');
        var split = [];
        for (var i = 0; i < queries.length; i++) {
            split = (0, array_utils_1.removeEmpties)(queries[i].split('='));
            if (0 in split) {
                searchObject[split[0]] = split[1];
            }
        }
        var parsed = {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            hash: parser.hash,
            protohost: parser.protocol + '//' + parser.host,
            search: parser.query,
            searchObject: searchObject,
            filename: (0, upath_1.basename)(parser.pathname)
        };
        return (0, deepmerge_ts_1.deepmerge)(parsed, parser);
    };
    urlParser.prototype.toString = function () {
        return this.resultStr;
    };
    return urlParser;
}());
exports.default = urlParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLXBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9jdXJsL3VybC1wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2Q0FBeUM7QUFDekMsK0JBQWlDO0FBQ2pDLHdEQUFpQztBQUNqQyxtREFBb0Q7QUFtQnBEOzs7O0dBSUc7QUFDSDtJQUdFLG1CQUFZLEdBQVc7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFDRCx5QkFBSyxHQUFMLFVBQU0sR0FBVztRQUNmLElBQUksQ0FBQyxHQUFHO1lBQUUsT0FBTztRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztRQUNyQixJQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBTSxZQUFZLEdBQWtDLEVBQUUsQ0FBQztRQUN2RCxJQUFNLE9BQU8sR0FBYSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JFLElBQUksS0FBSyxHQUFrQyxFQUFFLENBQUM7UUFDOUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsS0FBSyxHQUFHLElBQUEsMkJBQWEsRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFO2dCQUNkLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkM7U0FDRjtRQUNELElBQU0sTUFBTSxHQUFHO1lBQ2IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1lBQ3pCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7WUFDekIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTtZQUN6QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDakIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJO1lBQy9DLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSztZQUNwQixZQUFZLEVBQUUsWUFBWTtZQUMxQixRQUFRLEVBQUUsSUFBQSxnQkFBUSxFQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7U0FDcEMsQ0FBQztRQUNGLE9BQU8sSUFBQSx3QkFBUyxFQUFDLE1BQU0sRUFBRSxNQUFNLENBQWMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsNEJBQVEsR0FBUjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBcENELElBb0NDIn0=