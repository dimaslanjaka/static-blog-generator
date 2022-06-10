"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yamlBuild = exports.yamlParse = void 0;
var fs_1 = require("fs");
var yaml_1 = __importDefault(require("yaml"));
/**
 * Generic yaml parser
 * @param target
 * @returns
 */
function yamlParse(target) {
    if ((0, fs_1.existsSync)(target))
        return yaml_1.default.parse((0, fs_1.readFileSync)(target).toString());
    return yaml_1.default.parse(target);
}
exports.yamlParse = yamlParse;
/**
 * build object to yaml
 * @param obj
 * @returns
 */
function yamlBuild(obj) {
    return yaml_1.default.stringify(obj);
}
exports.yamlBuild = yamlBuild;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieWFtbC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9wYXJzZXIveWFtbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBOEM7QUFDOUMsOENBQXdCO0FBRXhCOzs7O0dBSUc7QUFDSCxTQUFnQixTQUFTLENBQ3ZCLE1BQWM7SUFFZCxJQUFJLElBQUEsZUFBVSxFQUFDLE1BQU0sQ0FBQztRQUFFLE9BQU8sY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFBLGlCQUFZLEVBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUMzRSxPQUFPLGNBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUxELDhCQUtDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLFNBQVMsQ0FBQyxHQUF3QjtJQUNoRCxPQUFPLGNBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsQ0FBQztBQUZELDhCQUVDIn0=