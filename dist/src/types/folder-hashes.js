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
exports.get_source_hash = exports.get_src_posts_hash = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var folder_hash_1 = require("folder-hash");
var filemanager_1 = require("../node/filemanager");
var md5_file_1 = require("../node/md5-file");
var _config_1 = __importStar(require("./_config"));
var options = {
    folders: {
        exclude: [
            '.*',
            'node_modules',
            'test_coverage',
            'tmp',
            'test',
            'tests',
            '*.log',
            '*.test.ts',
            '*.test.js'
        ]
    },
    files: {
        include: [
            '*.js',
            '*.ts',
            '*.md',
            '*.css',
            '*.scss',
            '*.less',
            '*.ejs',
            '*.html'
        ]
    }
};
/**
 * Get src-posts hashes
 * @returns
 */
function get_src_posts_hash() {
    return __awaiter(this, void 0, void 0, function () {
        var hash, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, folder_hash_1.hashElement)(_config_1.post_source_dir, options)];
                case 1:
                    hash = _a.sent();
                    return [2 /*return*/, (0, md5_file_1.md5)(hash.toString())];
                case 2:
                    error_1 = _a.sent();
                    console.error('hashing failed:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, null];
            }
        });
    });
}
exports.get_src_posts_hash = get_src_posts_hash;
/**
 * get folder hash of {@link config.source_dir}
 * @returns
 */
function get_source_hash() {
    return __awaiter(this, void 0, void 0, function () {
        var hash, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, folder_hash_1.hashElement)((0, filemanager_1.join)(_config_1.root, _config_1.default.source_dir), options)];
                case 1:
                    hash = _a.sent();
                    return [2 /*return*/, (0, md5_file_1.md5)(hash.toString())];
                case 2:
                    error_2 = _a.sent();
                    console.error('hashing failed:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, null];
            }
        });
    });
}
exports.get_source_hash = get_source_hash;
// @todo generate folder hashes every called once
bluebird_1.default.all([get_src_posts_hash(), get_source_hash()]).spread(function (src_posts, source) {
    (0, filemanager_1.write)((0, filemanager_1.join)(__dirname, '_config_hashes.json'), JSON.stringify({ 'src-posts': src_posts, source: source }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9sZGVyLWhhc2hlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy90eXBlcy9mb2xkZXItaGFzaGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0RBQWdDO0FBQ2hDLDJDQUEwQztBQUMxQyxtREFBa0Q7QUFDbEQsNkNBQXVDO0FBQ3ZDLG1EQUEwRDtBQUUxRCxJQUFNLE9BQU8sR0FBRztJQUNkLE9BQU8sRUFBRTtRQUNQLE9BQU8sRUFBRTtZQUNQLElBQUk7WUFDSixjQUFjO1lBQ2QsZUFBZTtZQUNmLEtBQUs7WUFDTCxNQUFNO1lBQ04sT0FBTztZQUNQLE9BQU87WUFDUCxXQUFXO1lBQ1gsV0FBVztTQUNaO0tBQ0Y7SUFDRCxLQUFLLEVBQUU7UUFDTCxPQUFPLEVBQUU7WUFDUCxNQUFNO1lBQ04sTUFBTTtZQUNOLE1BQU07WUFDTixPQUFPO1lBQ1AsUUFBUTtZQUNSLFFBQVE7WUFDUixPQUFPO1lBQ1AsUUFBUTtTQUNUO0tBQ0Y7Q0FDRixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBc0Isa0JBQWtCOzs7Ozs7O29CQUV2QixxQkFBTSxJQUFBLHlCQUFXLEVBQUMseUJBQWUsRUFBRSxPQUFPLENBQUMsRUFBQTs7b0JBQWxELElBQUksR0FBRyxTQUEyQztvQkFDeEQsc0JBQU8sSUFBQSxjQUFHLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUM7OztvQkFFNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxPQUFLLENBQUMsQ0FBQzs7d0JBRTFDLHNCQUFPLElBQUksRUFBQzs7OztDQUNiO0FBUkQsZ0RBUUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFzQixlQUFlOzs7Ozs7O29CQUdwQixxQkFBTSxJQUFBLHlCQUFXLEVBQUMsSUFBQSxrQkFBSSxFQUFDLGNBQUksRUFBRSxpQkFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFBOztvQkFBaEUsSUFBSSxHQUFHLFNBQXlEO29CQUN0RSxzQkFBTyxJQUFBLGNBQUcsRUFBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBQzs7O29CQUU1QixPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLE9BQUssQ0FBQyxDQUFDOzt3QkFFMUMsc0JBQU8sSUFBSSxFQUFDOzs7O0NBQ2I7QUFURCwwQ0FTQztBQUVELGlEQUFpRDtBQUNqRCxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FDNUQsVUFBQyxTQUFTLEVBQUUsTUFBTTtJQUNoQixJQUFBLG1CQUFLLEVBQ0gsSUFBQSxrQkFBSSxFQUFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxFQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLFFBQUEsRUFBRSxDQUFDLENBQ25ELENBQUM7QUFDSixDQUFDLENBQ0YsQ0FBQyJ9