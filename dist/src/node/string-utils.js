"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyStr = exports.replaceArr = exports.countWords = exports.cleanString = exports.isMatch = exports.strMatch = exports.cleanWhiteSpace = void 0;
/**
 * clean white spaces
 * @param text
 * @returns
 */
function cleanWhiteSpace(text) {
    if (typeof text == 'string')
        return text.replace(/\s+/gm, ' ');
    return text;
}
exports.cleanWhiteSpace = cleanWhiteSpace;
/**
 * easy regex match
 * @param str
 * @param pattern
 * @returns
 */
function strMatch(str, pattern) {
    var regex;
    if (typeof pattern == 'string') {
        regex = new RegExp(pattern, 'gm');
    }
    else {
        regex = pattern;
    }
    var match = str.match(regex) || false;
    if (Array.isArray(match)) {
        if (match.length > 0)
            return true;
    }
    return false;
}
exports.strMatch = strMatch;
/**
 * @see {@link strMatch}
 */
exports.isMatch = strMatch;
/**
 * clean string with exception char
 * @param text
 * @returns
 */
function cleanString(text, exception) {
    if (exception === void 0) { exception = '.,-_ '; }
    if (typeof text == 'string')
        return text.replace(new RegExp('[^a-zA-Z0-9' + exception + ']', 'gm'), '');
    return text;
}
exports.cleanString = cleanString;
/**
 * count words boundary
 * @param str
 * @returns
 */
function countWords(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi, '');
    str = str.replace(/[ ]{2,}/gi, ' ');
    str = str.replace(/\n /, '\n');
    return str.split(' ').length;
}
exports.countWords = countWords;
/**
 * Replace string by array pattern
 * @param array
 * @param replacement
 * @example
 * replaceArr('str', ['s','r'], ''); // t
 * replaceArr('str', ['s','r'], ['a s', 'ring']); // a string
 */
function replaceArr(str, array, replacement) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var ori = str;
    array.forEach(function (str, i) {
        if (typeof replacement == 'string') {
            ori = ori.replace(str, replacement);
        }
        else {
            ori = ori.replace(str, replacement[i]);
        }
    });
    return ori;
}
exports.replaceArr = replaceArr;
if (typeof ''.replaceAll != 'function') {
    String.prototype.replaceAll = function (search, replacement) {
        var find = typeof search == 'string' ? new RegExp(search, 'g') : search;
        return this.replace(find, replacement);
    };
}
/**
 * is variable an empty string ?
 * @param str
 * @returns
 */
function isEmptyStr(str) {
    var isStr = typeof str === 'string';
    var isEmpty = isStr && str.trim().length > 0;
    return isEmpty;
}
exports.isEmptyStr = isEmptyStr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLXV0aWxzLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL25vZGUvc3RyaW5nLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7O0dBSUc7QUFDSCxTQUFnQixlQUFlLENBQUMsSUFBWTtJQUMxQyxJQUFJLE9BQU8sSUFBSSxJQUFJLFFBQVE7UUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9ELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUhELDBDQUdDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixRQUFRLENBQUMsR0FBVyxFQUFFLE9BQXdCO0lBQzVELElBQUksS0FBYSxDQUFDO0lBQ2xCLElBQUksT0FBTyxPQUFPLElBQUksUUFBUSxFQUFFO1FBQzlCLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbkM7U0FBTTtRQUNMLEtBQUssR0FBRyxPQUFPLENBQUM7S0FDakI7SUFDRCxJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQztJQUN4QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEIsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztLQUNuQztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQVpELDRCQVlDO0FBRUQ7O0dBRUc7QUFDVSxRQUFBLE9BQU8sR0FBRyxRQUFRLENBQUM7QUFFaEM7Ozs7R0FJRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxJQUFZLEVBQUUsU0FBbUI7SUFBbkIsMEJBQUEsRUFBQSxtQkFBbUI7SUFDM0QsSUFBSSxPQUFPLElBQUksSUFBSSxRQUFRO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLEdBQUcsU0FBUyxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3RSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFKRCxrQ0FJQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixVQUFVLENBQUMsR0FBVztJQUNwQyxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6QyxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDcEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9CLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDL0IsQ0FBQztBQUxELGdDQUtDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLFVBQVUsQ0FDeEIsR0FBVyxFQUNYLEtBQTBCLEVBQzFCLFdBQThCO0lBRTlCLDREQUE0RDtJQUM1RCxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDZCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxPQUFPLFdBQVcsSUFBSSxRQUFRLEVBQUU7WUFDbEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ3JDO2FBQU07WUFDTCxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQWhCRCxnQ0FnQkM7QUFvQkQsSUFBSSxPQUFPLEVBQUUsQ0FBQyxVQUFVLElBQUksVUFBVSxFQUFFO0lBQ3RDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQzVCLE1BQXVCLEVBQ3ZCLFdBQWdCO1FBRWhCLElBQU0sSUFBSSxHQUFHLE9BQU8sTUFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDMUUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUM7Q0FDSDtBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixVQUFVLENBQUMsR0FBUTtJQUNqQyxJQUFNLEtBQUssR0FBRyxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUM7SUFDdEMsSUFBTSxPQUFPLEdBQUcsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFKRCxnQ0FJQyJ9