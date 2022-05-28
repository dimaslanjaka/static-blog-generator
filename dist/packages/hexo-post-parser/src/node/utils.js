"use strict";
/**
 * clean white spaces
 * @param s
 * @returns
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceArr = exports.cleanString = exports.cleanWhiteSpace = void 0;
function cleanWhiteSpace(text) {
    if (typeof text == 'string')
        return text.replace(/\s+/gm, ' ');
    return text;
}
exports.cleanWhiteSpace = cleanWhiteSpace;
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
 * Replace string by array pattern
 * @param array
 * @param replacement
 * @example
 * replaceArr('str', ['s','r'], ''); // t
 * replaceArr('str', ['s','r'], ['a s', 'ring']); // a string
 */
function replaceArr(str, array, replacement) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJwYWNrYWdlcy9oZXhvLXBvc3QtcGFyc2VyL3NyYy9ub2RlL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxTQUFnQixlQUFlLENBQUMsSUFBWTtJQUMxQyxJQUFJLE9BQU8sSUFBSSxJQUFJLFFBQVE7UUFBRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9ELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUhELDBDQUdDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxJQUFZLEVBQUUsU0FBbUI7SUFBbkIsMEJBQUEsRUFBQSxtQkFBbUI7SUFDM0QsSUFBSSxPQUFPLElBQUksSUFBSSxRQUFRO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLEdBQUcsU0FBUyxHQUFHLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3RSxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFKRCxrQ0FJQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixVQUFVLENBQ3hCLEdBQVcsRUFDWCxLQUEwQixFQUMxQixXQUE4QjtJQUU5QixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDZCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxPQUFPLFdBQVcsSUFBSSxRQUFRLEVBQUU7WUFDbEMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ3JDO2FBQU07WUFDTCxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQWZELGdDQWVDIn0=