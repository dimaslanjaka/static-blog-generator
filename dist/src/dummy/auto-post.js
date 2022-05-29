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
exports.generateDummyPosts = void 0;
var fs_extra_1 = require("fs-extra");
var gulp_1 = __importDefault(require("gulp"));
var upath_1 = require("upath");
var filemanager_1 = require("../node/filemanager");
var string_utils_1 = require("../node/string-utils");
var parsePost_1 = __importStar(require("../parser/post/parsePost"));
var _config_1 = __importStar(require("../types/_config"));
var destFolder = (0, upath_1.join)(_config_1.root, _config_1.default.source_dir, '_posts');
if (!(0, fs_extra_1.existsSync)(destFolder))
    (0, fs_extra_1.mkdirSync)(destFolder, { recursive: true });
// emptying generated dummy posts
(0, fs_extra_1.emptyDirSync)((0, upath_1.join)(destFolder, 'dummy'));
function generateDummyPosts(n) {
    if (n === void 0) { n = 5; }
    return __awaiter(this, void 0, void 0, function () {
        var result, x, gen, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = [];
                    x = 0;
                    _a.label = 1;
                case 1:
                    if (!(x < n)) return [3 /*break*/, 5];
                    return [4 /*yield*/, dummyPost(x)];
                case 2:
                    gen = _a.sent();
                    return [4 /*yield*/, (0, filemanager_1.write)((0, upath_1.join)(destFolder, (0, string_utils_1.replaceArr)(gen.metadata.permalink, [/.html$/, /.md$/], '.md')), (0, parsePost_1.buildPost)(gen))];
                case 3:
                    file = _a.sent();
                    result.push(String(file));
                    _a.label = 4;
                case 4:
                    x++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/, result];
            }
        });
    });
}
exports.generateDummyPosts = generateDummyPosts;
function dummyPost(counter) {
    if (counter === void 0) { counter = 0; }
    var result = {
        metadata: {
            title: 'Dummy Post ' + counter,
            category: ['dummy'],
            tags: ['dummy', 'sample'],
            permalink: '/dummy/dummy-post-' + counter + '.md',
            date: randomDate(new Date(2020, 0, 1), new Date(), 0, 24).toISOString()
        },
        body: 'Dummy Post Body ' + counter
    };
    var build = (0, parsePost_1.buildPost)(result);
    return (0, parsePost_1.default)((0, upath_1.join)(destFolder, result.metadata.permalink), build);
}
/**
 * pick random date from two dates
 * @param start
 * @param end
 * @param startHour
 * @param endHour
 * @returns
 * @example
 * randomDate(new Date(2020, 0, 1), new Date(), 0, 24)
 */
function randomDate(start, end, startHour, endHour) {
    var dateEnd = end instanceof Date ? end.getTime() : end;
    var dateStart = start instanceof Date ? start.getTime() : start;
    var date = new Date(+start + Math.random() * (dateEnd - dateStart));
    var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
    date.setHours(hour);
    return date;
}
var max = parseInt(_config_1.argv['m'] || _config_1.argv['max'] || 10);
gulp_1.default.task('dummy', function () {
    console.log('generating', max, 'dummies');
    return generateDummyPosts(max);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1wb3N0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2R1bW15L2F1dG8tcG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUErRDtBQUMvRCw4Q0FBd0I7QUFDeEIsK0JBQTZCO0FBQzdCLG1EQUE0QztBQUM1QyxxREFBa0Q7QUFDbEQsb0VBQXlFO0FBQ3pFLDBEQUFzRDtBQUV0RCxJQUFNLFVBQVUsR0FBRyxJQUFBLFlBQUksRUFBQyxjQUFJLEVBQUUsaUJBQU0sQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0QsSUFBSSxDQUFDLElBQUEscUJBQVUsRUFBQyxVQUFVLENBQUM7SUFBRSxJQUFBLG9CQUFTLEVBQUMsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDeEUsaUNBQWlDO0FBQ2pDLElBQUEsdUJBQVksRUFBQyxJQUFBLFlBQUksRUFBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUV4QyxTQUFzQixrQkFBa0IsQ0FBQyxDQUFLO0lBQUwsa0JBQUEsRUFBQSxLQUFLOzs7Ozs7b0JBQ3RDLE1BQU0sR0FBYSxFQUFFLENBQUM7b0JBQ25CLENBQUMsR0FBRyxDQUFDOzs7eUJBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFBO29CQUNQLHFCQUFNLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQTs7b0JBQXhCLEdBQUcsR0FBRyxTQUFrQjtvQkFDakIscUJBQU0sSUFBQSxtQkFBSyxFQUN0QixJQUFBLFlBQUksRUFDRixVQUFVLEVBQ1YsSUFBQSx5QkFBVSxFQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUM5RCxFQUNELElBQUEscUJB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