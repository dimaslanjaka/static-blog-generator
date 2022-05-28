"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeid = void 0;
var md5_file_1 = require("./md5-file");
/**
 * Persistent UUID V4 Generator based on inputted string
 * @param fromString `null`: based on caller function name, line, and path
 * @param fromString generate based on string (unique based on this string)
 * @returns ex: a2d6fee8-369b-bebc-3d8e-b8ff2faf40d3
 * @example
 * for (let index = 0; index < 5; index++) console.log(uuidv4()); // <- will printted same id
 */
function uuidv4(fromString) {
    var original = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'; // length 8-4-4-4-12
    if (typeof fromString === 'string') {
        var hash = (0, md5_file_1.md5)(fromString);
        original = original
            .replace(/^xxxxxxxx-xxxx/, hash.slice(0, 8) + '-' + hash.slice(9, 13))
            .replace(/xxx-xxxxxxxxxxxx$/, hash.slice(14, 17) + '-' + hash.slice(18, 30));
    }
    else {
        var err = new Error();
        var caller_line = err.stack.split('\n')[2];
        var index = caller_line.indexOf('at ');
        var dumpClean = caller_line.slice(index + 2, caller_line.length);
        return uuidv4((0, md5_file_1.md5)(dumpClean));
    }
    return original.replace(/[xy]/g, function (c) {
        if (typeof fromString !== 'string') {
            // if no input
            var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
        else {
            // if with input
            var r = 0;
            var v = r | 0x8;
            if (c == 'y')
                v = (r & 0x3) | 0x8;
            return v.toString(16);
        }
    });
}
exports.default = uuidv4;
/**
 * generate random id
 * @param n
 * @param prefix
 * @returns
 */
var makeid = function (n, prefix) {
    if (n === void 0) { n = 36; }
    if (prefix === void 0) { prefix = ''; }
    if (n > 1)
        return prefix + Math.random().toString(n).slice(2);
    var text = '';
    var charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < n; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
};
exports.makeid = makeid;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXVpZC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2hleG8tcG9zdC1wYXJzZXIvc3JjL25vZGUvdXVpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBaUM7QUFFakM7Ozs7Ozs7R0FPRztBQUNILFNBQXdCLE1BQU0sQ0FBQyxVQUFtQjtJQUNoRCxJQUFJLFFBQVEsR0FBRyxzQ0FBc0MsQ0FBQyxDQUFDLG9CQUFvQjtJQUMzRSxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUNsQyxJQUFNLElBQUksR0FBRyxJQUFBLGNBQUcsRUFBQyxVQUFVLENBQUMsQ0FBQztRQUM3QixRQUFRLEdBQUcsUUFBUTthQUNoQixPQUFPLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ3JFLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNoRjtTQUFNO1FBQ0wsSUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN4QixJQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLElBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkUsT0FBTyxNQUFNLENBQUMsSUFBQSxjQUFHLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUMvQjtJQUNELE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO1FBQzFDLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1lBQ2xDLGNBQWM7WUFDZCxJQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQ2hDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNyQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNMLGdCQUFnQjtZQUNoQixJQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUc7Z0JBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNsQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUE1QkQseUJBNEJDO0FBRUQ7Ozs7O0dBS0c7QUFDSSxJQUFNLE1BQU0sR0FBRyxVQUFDLENBQU0sRUFBRSxNQUFXO0lBQW5CLGtCQUFBLEVBQUEsTUFBTTtJQUFFLHVCQUFBLEVBQUEsV0FBVztJQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQUUsT0FBTyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2QsSUFBTSxPQUFPLEdBQUcsc0NBQXNDLENBQUM7SUFDdkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFBRSxJQUFJLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMvRixPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQU5XLFFBQUEsTUFBTSxVQU1qQiJ9