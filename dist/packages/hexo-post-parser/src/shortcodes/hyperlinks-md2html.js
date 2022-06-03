"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceMD2HTML = void 0;
var color_1 = __importDefault(require("../node/color"));
// fix all hyperlinks endsWith .md
// [test](test.md) -> [test](test.html)
var regex = /\[([^\]]+)\]\(([^)]+(.md))\)/gim;
var logname = color_1.default['Blizzard Blue']('[replaceMD2HTML]');
/**
 * Replace hyperlinks endswith .md with .html
 * @param content body string
 * @returns
 */
function replaceMD2HTML(content) {
    if (content.match(regex)) {
        content = content.replace(regex, function (wholeMatch, _index1, index2, index3) {
            // act here or after the loop...
            //console.log(index2, index3);
            var toReplace = index2;
            var replacement = index2.replace(new RegExp(index3 + '$'), '.html');
            console.log(logname, color_1.default.redBright(toReplace), '->', color_1.default.greenBright(replacement));
            //return wholeMatch.replace(index3, '.html');
            return wholeMatch.replace(toReplace, replacement);
        });
    }
    return content;
}
exports.replaceMD2HTML = replaceMD2HTML;
exports.default = replaceMD2HTML;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHlwZXJsaW5rcy1tZDJodG1sLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsicGFja2FnZXMvaGV4by1wb3N0LXBhcnNlci9zcmMvc2hvcnRjb2Rlcy9oeXBlcmxpbmtzLW1kMmh0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQWtDO0FBQ2xDLGtDQUFrQztBQUNsQyx1Q0FBdUM7QUFDdkMsSUFBTSxLQUFLLEdBQUcsaUNBQWlDLENBQUM7QUFDaEQsSUFBTSxPQUFPLEdBQUcsZUFBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFM0Q7Ozs7R0FJRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxPQUFlO0lBQzVDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN4QixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNO1lBQzVFLGdDQUFnQztZQUNoQyw4QkFBOEI7WUFDOUIsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDO1lBQ3pCLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGVBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLGVBQUssQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN2Riw2Q0FBNkM7WUFDN0MsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztLQUNKO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQWJELHdDQWFDO0FBRUQsa0JBQWUsY0FBYyxDQUFDIn0=