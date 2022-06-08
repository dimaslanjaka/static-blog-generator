"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_base64_image = exports.base64_to_image = void 0;
var axios_1 = __importDefault(require("axios"));
var fs_1 = require("fs");
var fs_extra_1 = require("fs-extra");
var filemanager_1 = require("../node/filemanager");
var md5_file_1 = require("../node/md5-file");
var _config_1 = __importDefault(require("../types/_config"));
/**
 * download images
 * @param src source url string
 * @param saveTo save directory path or file path
 * * If the Save target is a directory, then the file name will be searched by the 'Content-Disposition' header or based on MD5 Hash Source URL
 */
function downloadImage(src, saveTo, cache) {
    if (cache === void 0) { cache = true; }
    return __awaiter(this, void 0, void 0, function () {
        var e, stack, cacheLocation, parse, parseB64, convert, response, mime_1, filename, ext, stats, pipe, result, b64;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e = new Error();
                    if (!e.stack) {
                        try {
                            // IE requires the Error to actually be thrown or else the
                            // Error's 'stack' property is undefined.
                            throw e;
                        }
                        catch (e) {
                            if (!e.stack) {
                                //return 0; // IE < 10, likely
                            }
                        }
                    }
                    stack = e.stack
                        .toString()
                        .split(/\r\n|\n/)
                        .map(function (path) {
                        var split = path.split(':').map(function (s) { return s.replace(/at\s/, '').trim(); });
                        return {
                            path: split[0],
                            line: "".concat(split[1], ":").concat(split[2])
                        };
                    });
                    cacheLocation = (0, filemanager_1.join)(filemanager_1.cacheDir, (0, md5_file_1.md5)(stack[1].path), (0, md5_file_1.md5)(stack[1].line), (0, md5_file_1.md5)(saveTo));
                    if (cache) {
                        if ((0, fs_1.existsSync)(cacheLocation)) {
                            parse = JSON.parse((0, fs_1.readFileSync)(cacheLocation).toString());
                            parseB64 = parse_base64_image(parse.content);
                            convert = base64_to_image(parseB64.base64, parse.path, null, null);
                            if (typeof convert == 'string') {
                                parse.path = convert;
                                return [2 /*return*/, parse];
                            }
                        }
                    }
                    return [4 /*yield*/, (0, axios_1.default)({
                            method: 'get',
                            url: src,
                            responseType: 'stream'
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200) {
                        mime_1 = response.headers['content-type'];
                        if (mime_1.startsWith('image')) {
                            filename = null;
                            // get content disposition information
                            if (Object.hasOwnProperty.call(response.headers, 'content-disposition')) {
                                filename = response.headers['content-disposition']
                                    .match(new RegExp('filename=(.*)'))[1]
                                    .replaceAll('"', '');
                            }
                            // no content-disposition
                            if (filename === null) {
                                ext = '.' + mime_1.split('/')[1];
                                //return response.data.pipe(createWriteStream(tmp('downloaded-images', md5(src) + ext)));
                                filename = (0, md5_file_1.md5)(src) + ext;
                            }
                            if (typeof saveTo == 'string') {
                                stats = void 0;
                                if ((0, fs_1.existsSync)(saveTo))
                                    stats = (0, fs_1.statSync)(saveTo);
                                pipe = null;
                                // save to directory
                                if (stats && stats.isDirectory()) {
                                    pipe = response.data.pipe((0, fs_extra_1.createWriteStream)((0, filemanager_1.join)(saveTo, filename)));
                                }
                                else {
                                    pipe = response.data.pipe((0, fs_extra_1.createWriteStream)(saveTo));
                                }
                                result = {
                                    /** save location */
                                    path: null,
                                    /** writable stream */
                                    pipe: pipe
                                };
                                if (Object.hasOwnProperty.call(pipe, 'path')) {
                                    if (_config_1.default.verbose)
                                        console.log('saved to', pipe['path']);
                                    result.path = pipe['path'];
                                }
                                if (result.path) {
                                    b64 = "data:".concat(mime_1, ";base64,") +
                                        (0, fs_1.readFileSync)(result.path).toString('base64');
                                    (0, filemanager_1.write)(cacheLocation, {
                                        path: result.path,
                                        content: b64
                                    });
                                }
                                return [2 /*return*/, result];
                            }
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = downloadImage;
/**
 * parse image base64 encoded
 * @param data
 * @returns
 */
function parse_base64_image(data) {
    var reg = /^data:image\/([\w+]+);base64,([\s\S]+)/;
    var match = data.match(reg);
    var baseType = {
        jpeg: 'jpg'
    };
    baseType['svg+xml'] = 'svg';
    if (!match) {
        throw new Error('image base64 data error');
    }
    var extname = baseType[match[1]] ? baseType[match[1]] : match[1];
    return {
        /** extension name */
        extname: '.' + extname,
        /** base64 encoded */
        base64: match[2]
    };
}
exports.parse_base64_image = parse_base64_image;
/**
 * Convert image base64 data to img
 *
 * @param data
 * @param destpath
 * @param name default null
 * @param callback default null
 * @returns string path file
 * @example
 * // save to directory with filename
 * base64_to_image('data:image/png;base64,...', '/folder/name', 'file-name', function(err, filepath) {});
 * // remove first data:image/png;base64, from {@param data}
 * // save to file directly with callback
 * base64_to_image('base64_encoded_string', '/folder/filename.jpg', null, function(err, filepath) {});
 * // save to file directly without callback, return string
 * base64_to_image('base64_encoded_string', '/folder/filename.jpg', null, null);
 */
function base64_to_image(data, destpath, name, callback) {
    if (name === void 0) { name = null; }
    if (callback === void 0) { callback = null; }
    if (typeof data === 'string' && typeof name === 'string') {
        var filepath_1;
        if (data.startsWith('data:image')) {
            // if data:image persist
            var result = parse_base64_image(data);
            filepath_1 = (0, filemanager_1.join)(destpath, name + result.extname);
            if (typeof callback === 'function') {
                return (0, fs_extra_1.writeFile)(filepath_1, result.base64, { encoding: 'base64' }, function (err) {
                    callback(err, filepath_1);
                });
            }
            (0, fs_extra_1.writeFileSync)(filepath_1, result.base64, { encoding: 'base64' });
        }
        else {
            filepath_1 = destpath;
            if (typeof callback === 'function') {
                return (0, fs_extra_1.writeFile)(filepath_1, data, { encoding: 'base64' }, function (err) {
                    callback(err, filepath_1);
                });
            }
            (0, fs_extra_1.writeFileSync)(filepath_1, data, { encoding: 'base64' });
        }
        return filepath_1;
    }
}
exports.base64_to_image = base64_to_image;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQtaW1hZ2UuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY3VybC9kb3dubG9hZC1pbWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMEI7QUFDMUIseUJBQXdEO0FBQ3hELHFDQUF1RTtBQUN2RSxtREFBNEQ7QUFDNUQsNkNBQXVDO0FBQ3ZDLDZEQUFzQztBQWN0Qzs7Ozs7R0FLRztBQUNILFNBQThCLGFBQWEsQ0FDekMsR0FBVyxFQUNYLE1BQWMsRUFDZCxLQUFZO0lBQVosc0JBQUEsRUFBQSxZQUFZOzs7Ozs7b0JBRU4sQ0FBQyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO3dCQUNaLElBQUk7NEJBQ0YsMERBQTBEOzRCQUMxRCx5Q0FBeUM7NEJBQ3pDLE1BQU0sQ0FBQyxDQUFDO3lCQUNUO3dCQUFDLE9BQU8sQ0FBQyxFQUFFOzRCQUNWLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO2dDQUNaLDhCQUE4Qjs2QkFDL0I7eUJBQ0Y7cUJBQ0Y7b0JBQ0ssS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLO3lCQUNsQixRQUFRLEVBQUU7eUJBQ1YsS0FBSyxDQUFDLFNBQVMsQ0FBQzt5QkFDaEIsR0FBRyxDQUFDLFVBQUMsSUFBSTt3QkFDUixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUE1QixDQUE0QixDQUFDLENBQUM7d0JBQ3ZFLE9BQU87NEJBQ0wsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ2QsSUFBSSxFQUFFLFVBQUcsS0FBSyxD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