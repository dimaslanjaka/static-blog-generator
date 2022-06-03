"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractText = void 0;
var chalk_1 = __importDefault(require("chalk"));
var fs = __importStar(require("fs"));
var path_1 = __importDefault(require("path"));
var logname = chalk_1.default.bgMagenta.whiteBright('[extract-text]');
function extractText(file, str) {
    var regex = /<!--\s+?extract-text\s+?(.+?)\s+?-->/gim;
    var m;
    var _loop_1 = function () {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        var allmatch = m[0];
        var bracketmatch = m[1];
        //console.info(logname, allmatch, bracketmatch);
        // search from file directory
        var directFile = path_1.default.join(path_1.default.dirname(file.toString()), bracketmatch);
        if (fs.existsSync(directFile)) {
            console.info("".concat(logname, " found from direct ").concat(directFile.replace(process.cwd() + '/', '')));
            var directRead = fs.readFileSync(directFile).toString();
            str = str.replace(allmatch, directRead);
        }
        else {
            // search from workspace directory
            console.info("".concat(logname, " found from workspace ").concat(directFile.replace(process.cwd() + '/', '')));
            var rootFile = path_1.default.join(process.cwd(), bracketmatch);
            if (fs.existsSync(rootFile)) {
                var rootRead_1 = fs.readFileSync(rootFile).toString();
                str = str.replace(allmatch, function () { return rootRead_1; });
            }
        }
    };
    while ((m = regex.exec(str)) !== null) {
        _loop_1();
    }
    return str;
}
exports.extractText = extractText;
exports.default = extractText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdFRleHQuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJwYWNrYWdlcy9oZXhvLXBvc3QtcGFyc2VyL3NyYy9zaG9ydGNvZGVzL2V4dHJhY3RUZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBQzFCLHFDQUF5QjtBQUN6Qiw4Q0FBd0I7QUFFeEIsSUFBTSxPQUFPLEdBQUcsZUFBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUU5RCxTQUFnQixXQUFXLENBQUMsSUFBWSxFQUFFLEdBQVc7SUFDbkQsSUFBTSxLQUFLLEdBQUcseUNBQXlDLENBQUM7SUFDeEQsSUFBSSxDQUFrQixDQUFDOztRQUVyQixvRUFBb0U7UUFDcEUsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDL0IsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ25CO1FBRUQsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixnREFBZ0Q7UUFFaEQsNkJBQTZCO1FBQzdCLElBQU0sVUFBVSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUMxRSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDN0IsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFHLE9BQU8sZ0NBQXNCLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBRSxDQUFDLENBQUM7WUFDNUYsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMxRCxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDekM7YUFBTTtZQUNMLGtDQUFrQztZQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUcsT0FBTyxtQ0FBeUIsVUFBVSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFFLENBQUMsQ0FBQztZQUMvRixJQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN4RCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzNCLElBQU0sVUFBUSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3RELEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxjQUFNLE9BQUEsVUFBUSxFQUFSLENBQVEsQ0FBQyxDQUFDO2FBQzdDO1NBQ0Y7O0lBeEJILE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUk7O0tBeUJwQztJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQTlCRCxrQ0E4QkM7QUFDRCxrQkFBZSxXQUFXLENBQUMifQ==