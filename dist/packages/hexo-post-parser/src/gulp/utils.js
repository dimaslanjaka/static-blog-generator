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
exports.isValidHttpUrl = exports.isEmpty = exports.slash = exports.copyDir = exports.loopDir = void 0;
var fs_1 = __importDefault(require("fs"));
var fse = __importStar(require("fs-extra"));
var path_1 = __importDefault(require("path"));
//console.log(loopDir(path.join(process.cwd(), "source")));
/**
 * Loop dir recursive
 * @param destDir
 * @param debug
 */
function loopDir(destDir, debug) {
    if (debug === void 0) { debug = false; }
    if (!fs_1.default.lstatSync(destDir).isDirectory()) {
        if (debug)
            console.error(destDir + " isn't folder");
        return;
    }
    var result = [];
    var readDir = fs_1.default.readdirSync(destDir);
    if (readDir) {
        if (debug)
            console.log(readDir.length + ' files to process');
        readDir.forEach(function (file) {
            var absolute = path_1.default.join(destDir.toString(), file);
            if (fs_1.default.statSync(absolute).isDirectory()) {
                result = loopDir(absolute).concat(result);
            }
            else {
                result.push(absolute);
            }
        });
    }
    return result;
}
exports.loopDir = loopDir;
// eslint-disable-next-line no-unused-vars
function copyDir(source, dest, callback) {
    if (callback === void 0) { callback = function (err) {
        if (err) {
            console.error(err);
            console.error('error');
        }
        else {
            console.log('success!');
        }
    }; }
    return fse.copy(source, dest, callback);
}
exports.copyDir = copyDir;
/**
 * slash alternative
 * ```bash
 * npm i slash #usually
 * ```
 * @url {@link https://github.com/sindresorhus/slash}
 * @param path
 */
function slash(path) {
    var isExtendedLengthPath = /^\\\\\?\\/.test(path);
    var hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }
    return path.replace(/\\/g, '/');
}
exports.slash = slash;
/**
 * check variable is empty, null, undefined, object/array length 0, number is 0
 * @param data
 * @returns
 */
var isEmpty = function (data) {
    if (data === null)
        return true;
    if (typeof data === 'string' && data.trim().length === 0)
        return true;
    if (typeof data === 'undefined')
        return true;
    if (typeof data === 'number') {
        if (data === 0)
            return true;
    }
    if (typeof data === 'object') {
        if (Array.isArray(data) && data.length === 0)
            return true;
        if (data.constructor === Object && Object.keys(data).length === 0)
            return true;
    }
    return false;
};
exports.isEmpty = isEmpty;
/**
 * Cached validated urls
 */
var validatedHttpUrl = {};
/**
 * Cacheable validate url is valid and http or https protocol
 * @param str
 * @returns
 */
function isValidHttpUrl(str) {
    if (typeof validatedHttpUrl[str] === 'boolean')
        return validatedHttpUrl[str];
    var url;
    try {
        url = new URL(str);
    }
    catch (_) {
        return false;
    }
    var validate = url.protocol === 'http:' || url.protocol === 'https:';
    if (validate) {
        validatedHttpUrl[str] = validate;
    }
    return validate;
}
exports.isValidHttpUrl = isValidHttpUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJwYWNrYWdlcy9oZXhvLXBvc3QtcGFyc2VyL3NyYy9ndWxwL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQW9CO0FBQ3BCLDRDQUFnQztBQUNoQyw4Q0FBd0I7QUFHeEIsMkRBQTJEO0FBQzNEOzs7O0dBSUc7QUFDSCxTQUFnQixPQUFPLENBQUMsT0FBNkIsRUFBRSxLQUFhO0lBQWIsc0JBQUEsRUFBQSxhQUFhO0lBQ2xFLElBQUksQ0FBQyxZQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1FBQ3hDLElBQUksS0FBSztZQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQyxDQUFDO1FBQ3BELE9BQU87S0FDUjtJQUVELElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUUxQixJQUFNLE9BQU8sR0FBRyxZQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLElBQUksT0FBTyxFQUFFO1FBQ1gsSUFBSSxLQUFLO1lBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLG1CQUFtQixDQUFDLENBQUM7UUFDN0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUk7WUFDNUIsSUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckQsSUFBSSxZQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUN2QyxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUMzQztpQkFBTTtnQkFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUF0QkQsMEJBc0JDO0FBRUQsMENBQTBDO0FBQzFDLFNBQWdCLE9BQU8sQ0FDckIsTUFBYyxFQUNkLElBQVksRUFDWixRQU9DO0lBUEQseUJBQUEsRUFBQSxxQkFBcUIsR0FBZTtRQUNsQyxJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN4QjthQUFNO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBYkQsMEJBYUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLElBQVk7SUFDaEMsSUFBTSxvQkFBb0IsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BELElBQU0sV0FBVyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHVDQUF1QztJQUUzRixJQUFJLG9CQUFvQixJQUFJLFdBQVcsRUFBRTtRQUN2QyxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBVEQsc0JBU0M7QUFFRDs7OztHQUlHO0FBQ0ksSUFBTSxPQUFPLEdBQUcsVUFBQyxJQUFTO0lBQy9CLElBQUksSUFBSSxLQUFLLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQztJQUMvQixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUN0RSxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVc7UUFBRSxPQUFPLElBQUksQ0FBQztJQUM3QyxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUM1QixJQUFJLElBQUksS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7S0FDN0I7SUFDRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUM1QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDMUQsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7S0FDaEY7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQztBQVpXLFFBQUEsT0FBTyxXQVlsQjtBQUVGOztHQUVHO0FBQ0gsSUFBTSxnQkFBZ0IsR0FBa0IsRUFBRSxDQUFDO0FBRTNDOzs7O0dBSUc7QUFDSCxTQUFnQixjQUFjLENBQUMsR0FBVztJQUN4QyxJQUFJLE9BQU8sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUztRQUFFLE9BQU8sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0UsSUFBSSxHQUFRLENBQUM7SUFFYixJQUFJO1FBQ0YsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsS0FBSyxPQUFPLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUM7SUFDdkUsSUFBSSxRQUFRLEVBQUU7UUFDWixnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUM7S0FDbEM7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBZkQsd0NBZUMifQ==