#!/usr/bin/env node
"use strict";
// compiled location in dist/src/bin/sbg.js
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
var fs_1 = require("fs");
var path_1 = require("path");
var yargs_1 = __importDefault(require("yargs"));
var gulpfile_1 = __importDefault(require("../../gulpfile"));
var clean_1 = require("../gulp/tasks/clean");
var assets_1 = require("../gulp/tasks/copy/assets");
var posts_1 = require("../gulp/tasks/copy/posts");
var remove_inline_style_1 = require("../gulp/tasks/copy/remove-inline-style");
var generate_after_1 = require("../gulp/tasks/generate-after");
var generate_assets_1 = require("../gulp/tasks/generate-assets");
var generate_feed_1 = require("../gulp/tasks/generate-feed");
var generate_posts_1 = require("../gulp/tasks/generate-posts");
var generate_template_1 = require("../gulp/tasks/generate-template");
var color_1 = __importDefault(require("../node/color"));
var filemanager_1 = require("../node/filemanager");
var yaml_1 = require("../parser/yaml");
var _config_1 = __importStar(require("../types/_config"));
yargs_1.default
    .scriptName('sbg')
    .usage('usage: sbg <command>')
    .command('$0', 'the default command', function () { }, function () {
    yargs_1.default.showHelp();
})
    .command('get <key>', 'getter config', function (yargs) {
    yargs.positional("key", {
        type: "string",
        describe: "property name"
    });
}, function (_a) {
    var key = _a.key;
    if (key) {
        if (_config_1.default[key]) {
            console.log(_config_1.default[key]);
        }
        else {
            console.log("property ".concat(color_1.default.redBright(key), " in config doesnt exists"));
        }
    }
    else {
        yargs_1.default.showHelp();
    }
})
    // config set
    .command('set <key> <value>', 'setter config', function (yargs) {
    yargs.positional("key", {
        type: "string",
        describe: "property key"
    });
    yargs.positional("value", {
        type: "string",
        describe: "new property value"
    });
}, function (_a) {
    var key = _a.key, value = _a.value;
    if (key && value) {
        //console.log(set, key, value);
        var configPath = (0, fs_1.existsSync)((0, path_1.join)(process.cwd(), '_config.cached.yml'))
            ? (0, path_1.join)(process.cwd(), '_config.cached.yml')
            : null;
        var parse = {};
        if (configPath !== null) {
            parse = (0, yaml_1.yamlParse)(configPath);
        }
        parse[key] = value;
        if (_config_1.verbose)
            console.log("property ".concat(color_1.default.greenBright(key), " settled"), _config_1.default[key]);
        (0, filemanager_1.write)((0, path_1.join)(process.cwd(), '_config.cached.yml'), (0, yaml_1.yamlBuild)(parse));
    }
    else {
        yargs_1.default.showHelp();
    }
})
    // copy
    .command('copy [key]', "copy all source assets and posts to ".concat(_config_1.default.source_dir, "/_posts"), function (yargs) {
    yargs.positional("posts", {
        type: "string",
        describe: "copy source posts to ".concat(_config_1.default.source_dir, "/_posts")
    });
    yargs.positional("assets", {
        type: "string",
        describe: "copy source assets to ".concat(_config_1.default.source_dir, "/_posts")
    });
    yargs.positional("remove-inline-style", {
        type: "string",
        describe: "remove inline style from html ".concat(_config_1.default.source_dir, "/_posts (useful for migrated from blogger)")
    });
    yargs.positional("blogger", {
        type: "string",
        describe: "'<series>'('copy assets', 'copy posts', 'copy remove-inline-style')"
    });
}, function (_a) {
    var key = _a.key;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = key;
                    switch (_b) {
                        case 'posts': return [3 /*break*/, 1];
                        case 'assets': return [3 /*break*/, 3];
                        case 'remove-inline-style': return [3 /*break*/, 5];
                        case 'blogger': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 11];
                case 1: return [4 /*yield*/, (0, posts_1.copyPosts)()];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 13];
                case 3: return [4 /*yield*/, (0, assets_1.copyAssets)()];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 13];
                case 5: return [4 /*yield*/, (0, remove_inline_style_1.gulpInlineStyle)()];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 13];
                case 7: return [4 /*yield*/, (0, assets_1.copyAssets)()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, posts_1.copyPosts.call(null)];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, (0, remove_inline_style_1.gulpInlineStyle)()];
                case 10:
                    _c.sent();
                    return [3 /*break*/, 13];
                case 11:
                    if (_config_1.verbose)
                        console.log(color_1.default.Asparagus('copying all posts and assets'));
                    return [4 /*yield*/, (0, assets_1.copyAssets)()];
                case 12:
                    _c.sent();
                    (0, posts_1.copyPosts)();
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
})
    // generator
    .command('generate [key]', "generate all ".concat(_config_1.default.source_dir, " to ").concat(_config_1.default.public_dir), function (yargs) {
    yargs.positional("posts", {
        type: "string",
        describe: "generate ".concat(_config_1.default.source_dir, " posts to ").concat(_config_1.default.public_dir)
    });
    yargs.positional("assets", {
        type: "string",
        describe: "generate ".concat(_config_1.default.source_dir, " assets to ").concat(_config_1.default.public_dir)
    });
    yargs.positional("template", {
        type: "string",
        describe: "generate ".concat(_config_1.default.source_dir, " template assets to ").concat(_config_1.default.public_dir)
    });
}, function (_a) {
    var key = _a.key;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = key;
                    switch (_b) {
                        case 'posts': return [3 /*break*/, 1];
                        case 'assets': return [3 /*break*/, 3];
                        case 'template': return [3 /*break*/, 5];
                        case 'feeds': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 1: return [4 /*yield*/, (0, generate_posts_1.generatePosts)()];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 3: return [4 /*yield*/, (0, generate_assets_1.generateAssets)()];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 5:
                    (0, generate_template_1.generateTemplate)();
                    return [3 /*break*/, 12];
                case 6: return [4 /*yield*/, (0, generate_feed_1.generateFeeds)()];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 8:
                    (0, generate_template_1.generateTemplate)();
                    return [4 /*yield*/, (0, generate_assets_1.generateAssets)()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, (0, generate_posts_1.generatePosts)()];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, (0, generate_feed_1.generateFeeds)()];
                case 11:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
})
    // cleaner
    .command('clean [key]', 'clean task', function (yargs) {
    yargs.positional("tmp", {
        type: "string",
        describe: "clean temporarily folder"
    });
    yargs.positional("db", {
        type: "string",
        describe: "clean databases folder"
    });
    yargs.positional("public", {
        type: "string",
        describe: "clean ".concat(_config_1.default.public_dir, " folder")
    });
    yargs.positional("posts", {
        type: "string",
        describe: "clean ".concat(_config_1.default.public_dir, "/_posts folder")
    });
}, function (_a) {
    var key = _a.key;
    switch (key) {
        case 'tmp':
            (0, clean_1.clean_tmp)();
            break;
        case 'db':
            (0, clean_1.clean_db)();
            break;
        case 'posts':
            (0, clean_1.clean_posts)();
            break;
        case 'public':
            (0, clean_1.clean_public)();
            break;
        default:
            (0, clean_1.clean_db)();
            (0, clean_1.clean_posts)();
            (0, clean_1.clean_public)();
            (0, clean_1.clean_tmp)();
            break;
    }
})
    // deployer
    .command('deploy', 'deploy to repository', function () { }, function () {
    if ('deploy' in _config_1.default)
        if ('type' in _config_1.default.deploy) {
            gulpfile_1.default.series('deploy-' + _config_1.default['deploy']['type'])(null);
        }
})
    // safelinkify
    .command('after [key]', 'process generated site', function (yargs) {
    yargs.positional("safelink", {
        type: "string",
        describe: "safelinkify all generated site"
    });
}, function (_a) {
    var key = _a.key;
    switch (key) {
        case 'safelink':
            (0, generate_after_1.safelinkifyGenerated)(null);
            break;
        default:
            (0, generate_after_1.safelinkifyGenerated)(null);
            break;
    }
})
    .option('nocache', {
    describe: 'disable cache',
    demandOption: false
})
    .help('help')
    .alias('help', 'h')
    .alias('help', '?')
    .wrap(null).argv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2JnLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2Jpbi9zYmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyQ0FBMkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFM0MseUJBQWdDO0FBQ2hDLDZCQUE0QjtBQUM1QixnREFBMEI7QUFDMUIsNERBQWtDO0FBQ2xDLDZDQUs2QjtBQUM3QixvREFBdUQ7QUFDdkQsa0RBQXFEO0FBQ3JELDhFQUF5RTtBQUN6RSwrREFBb0U7QUFDcEUsaUVBQStEO0FBQy9ELDZEQUE0RDtBQUM1RCwrREFBNkQ7QUFDN0QscUVBQW1FO0FBQ25FLHdEQUFrQztBQUNsQyxtREFBNEM7QUFDNUMsdUNBQXNEO0FBQ3RELDBEQUFrRTtBQUVsRSxlQUFLO0tBQ0YsVUFBVSxDQUFDLEtBQUssQ0FBQztLQUNqQixLQUFLLENBQUMsc0JBQXNCLENBQUM7S0FDN0IsT0FBTyxDQUNOLElBQUksRUFDSixxQkFBcUIsRUFDckIsY0FBTyxDQUFDLEVBQ1I7SUFDRSxlQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDbkIsQ0FBQyxDQUNGO0tBQ0EsT0FBTyxDQUNOLFdBQVcsRUFDWCxlQUFlLEVBQ2YsVUFBVSxLQUFLO0lBQ2IsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7UUFDdEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxRQUFRLEVBQUUsZUFBZTtLQUMxQixDQUFDLENBQUM7QUFDTCxDQUFDLEVBQ0QsVUFBQyxFQUFPO1FBQUwsR0FBRyxTQUFBO0lBQ0osSUFBSSxHQUFHLEVBQUU7UUFDUCxJQUFJLGlCQUFNLENBQVMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBTSxDQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEM7YUFBTTtZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQ1QsbUJBQVksZUFBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsNkJBQTBCLENBQzNELENBQUM7U0FDSDtLQUNGO1NBQU07UUFDTCxlQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDbEI7QUFDSCxDQUFDLENBQ0Y7SUFDRCxhQUFhO0tBQ1osT0FBTyxDQUNOLG1CQUFtQixFQUNuQixlQUFlLEVBQ2YsVUFBQyxLQUFLO0lBQ0osS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7UUFDdEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxRQUFRLEVBQUUsY0FBYztLQUN6QixDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtRQUN4QixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxvQkFBb0I7S0FDL0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxFQUNELFVBQUMsRUFBYztRQUFaLEdBQUcsU0FBQSxFQUFFLEtBQUssV0FBQTtJQUNYLElBQUksR0FBRyxJQUFJLEtBQUssRUFBRTtRQUNoQiwrQkFBK0I7UUFDL0IsSUFBTSxVQUFVLEdBQUcsSUFBQSxlQUFVLEVBQUMsSUFBQSxXQUFJLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLG9CQUFvQixDQUFDLENBQUM7WUFDdEUsQ0FBQyxDQUFDLElBQUEsV0FBSSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxvQkFBb0IsQ0FBQztZQUMzQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1QsSUFBSSxLQUFLLEdBQXdCLEVBQUUsQ0FBQztRQUNwQyxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7WUFDdkIsS0FBSyxHQUFHLElBQUEsZ0JBQVMsRUFBZ0IsVUFBVSxDQUFDLENBQUM7U0FDOUM7UUFFRCxLQUFLLENBQVMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksaUJBQU87WUFDVCxPQUFPLENBQUMsR0FBRyxDQUNULG1CQUFZLGVBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLGFBQVUsRUFDNUMsaUJBQU0sQ0FBUyxHQUFHLENBQUMsQ0FDcEIsQ0FBQztRQUNKLElBQUEsbUJBQUssRUFBQyxJQUFBLFdBQUksRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsb0JBQW9CLENBQUMsRUFBRSxJQUFBLGdCQUFTLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUNwRTtTQUFNO1FBQ0wsZUFBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQyxDQUNGO0lBQ0QsT0FBTztLQUNOLE9BQU8sQ0FDTixZQUFZLEVBQ1osOENBQXVDLGlCQUFNLENBQUMsVUFBVSxZQUFTLEVBQ2pFLFVBQUMsS0FBSztJQUNKLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFO1FBQ3hCLElBQUksRUFBRSxRQUFRO1FBQ2QsUUFBUSxFQUFFLCtCQUF3QixpQkFBTSxDQUFDLFVBQVUsWUFBUztLQUM3RCxDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtRQUN6QixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxnQ0FBeUIsaUJBQU0sQ0FBQyxVQUFVLFlBQVM7S0FDOUQsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRTtRQUN0QyxJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSx3Q0FBaUMsaUJBQU0sQ0FBQyxVQUFVLCtDQUE0QztLQUN6RyxDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRTtRQUMxQixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxxRUFBcUU7S0FDaEYsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxFQUNELFVBQU8sRUFBTztRQUFMLEdBQUcsU0FBQTs7Ozs7O29CQUNGLEtBQUEsR0FBRyxDQUFBOzs2QkFDSixPQUFPLENBQUMsQ0FBUix3QkFBTzs2QkFHUCxRQUFRLENBQUMsQ0FBVCx3QkFBUTs2QkFHUixxQkFBcUIsQ0FBQyxDQUF0Qix3QkFBcUI7NkJBR3JCLFNBQVMsQ0FBQyxDQUFWLHdCQUFTOzs7d0JBUloscUJBQU0sSUFBQSxpQkFBUyxHQUFFLEVBQUE7O29CQUFqQixTQUFpQixDQUFDO29CQUNsQix5QkFBTTt3QkFFTixxQkFBTSxJQUFBLG1CQUFVLEdBQUUsRUFBQTs7b0JBQWxCLFNBQWtCLENBQUM7b0JBQ25CLHlCQUFNO3dCQUVOLHFCQUFNLElBQUEscUNBQWUsR0FBRSxFQUFBOztvQkFBdkIsU0FBdUIsQ0FBQztvQkFDeEIseUJBQU07d0JBRU4scUJBQU0sSUFBQSxtQkFBVSxHQUFFLEVBQUE7O29CQUFsQixTQUFrQixDQUFDO29CQUNuQixxQkFBTSxpQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQTs7b0JBQTFCLFNBQTBCLENBQUM7b0JBQzNCLHFCQUFNLElBQUEscUNBQWUsR0FBRSxFQUFBOztvQkFBdkIsU0FBdUIsQ0FBQztvQkFDeEIseUJBQU07O29CQUVOLElBQUksaUJBQU87d0JBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsU0FBUyxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQztvQkFDL0QscUJBQU0sSUFBQSxtQkFBVSxHQUFFLEVBQUE7O29CQUFsQixTQUFrQixDQUFDO29CQUNuQixJQUFBLGlCQUFTLEdBQUUsQ0FBQztvQkFDWix5QkFBTTs7Ozs7Q0FFWCxDQUNGO0lBQ0QsWUFBWTtLQUNYLE9BQU8sQ0FDTixnQkFBZ0IsRUFDaEIsdUJBQWdCLGlCQUFNLENBQUMsVUFBVSxpQkFBTyxpQkFBTSxDQUFDLFVBQVUsQ0FBRSxFQUMzRCxVQUFDLEtBQUs7SUFDSixLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtRQUN4QixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxtQkFBWSxpQkFBTSxDQUFDLFVBQVUsdUJBQWEsaUJBQU0sQ0FBQyxVQUFVLENBQUU7S0FDeEUsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7UUFDekIsSUFBSSxFQUFFLFFBQVE7UUFDZCxRQUFRLEVBQUUsbUJBQVksaUJBQU0sQ0FBQyxVQUFVLHdCQUFjLGlCQUFNLENBQUMsVUFBVSxDQUFFO0tBQ3pFLENBQUMsQ0FBQztJQUNILEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO1FBQzNCLElBQUksRUFBRSxRQUFRO1FBQ2QsUUFBUSxFQUFFLG1CQUFZLGlCQUFNLENBQUMsVUFBVSxpQ0FBdUIsaUJBQU0sQ0FBQyxVQUFVLENBQUU7S0FDbEYsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxFQUNELFVBQU8sRUFBTztRQUFMLEdBQUcsU0FBQTs7Ozs7O29CQUNGLEtBQUEsR0FBRyxDQUFBOzs2QkFDSixPQUFPLENBQUMsQ0FBUix3QkFBTzs2QkFHUCxRQUFRLENBQUMsQ0FBVCx3QkFBUTs2QkFHUixVQUFVLENBQUMsQ0FBWCx3QkFBVTs2QkFHVixPQUFPLENBQUMsQ0FBUix3QkFBTzs7O3dCQVJWLHFCQUFNLElBQUEsOEJBQWEsR0FBRSxFQUFBOztvQkFBckIsU0FBcUIsQ0FBQztvQkFDdEIseUJBQU07d0JBRU4scUJBQU0sSUFBQSxnQ0FBYyxHQUFFLEVBQUE7O29CQUF0QixTQUFzQixDQUFDO29CQUN2Qix5QkFBTTs7b0JBRU4sSUFBQSxvQ0FBZ0IsR0FBRSxDQUFDO29CQUNuQix5QkFBTTt3QkFFTixxQkFBTSxJQUFBLDZCQUFhLEdBQUUsRUFBQTs7b0JBQXJCLFNBQXFCLENBQUM7b0JBQ3RCLHlCQUFNOztvQkFFTixJQUFBLG9DQUFnQixHQUFFLENBQUM7b0JBQ25CLHFCQUFNLElBQUEsZ0NBQWMsR0FBRSxFQUFBOztvQkFBdEIsU0FBc0IsQ0FBQztvQkFDdkIscUJBQU0sSUFBQSw4QkFBYSxHQUFFLEVBQUE7O29CQUFyQixTQUFxQixDQUFDO29CQUN0QixxQkFBTSxJQUFBLDZCQUFhLEdBQUUsRUFBQTs7b0JBQXJCLFNBQXFCLENBQUM7b0JBQ3RCLHlCQUFNOzs7OztDQUVYLENBQ0Y7SUFDRCxVQUFVO0tBQ1QsT0FBTyxDQUNOLGFBQWEsRUFDYixZQUFZLEVBQ1osVUFBQyxLQUFLO0lBQ0osS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7UUFDdEIsSUFBSSxFQUFFLFFBQVE7UUFDZCxRQUFRLEVBQUUsMEJBQTBCO0tBQ3JDLENBQUMsQ0FBQztJQUNILEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFO1FBQ3JCLElBQUksRUFBRSxRQUFRO1FBQ2QsUUFBUSxFQUFFLHdCQUF3QjtLQUNuQyxDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtRQUN6QixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxnQkFBUyxpQkFBTSxDQUFDLFVBQVUsWUFBUztLQUM5QyxDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtRQUN4QixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxnQkFBUyxpQkFBTSxDQUFDLFVBQVUsbUJBQWdCO0tBQ3JELENBQUMsQ0FBQztBQUNMLENBQUMsRUFDRCxVQUFDLEVBQU87UUFBTCxHQUFHLFNBQUE7SUFDSixRQUFRLEdBQUcsRUFBRTtRQUNYLEtBQUssS0FBSztZQUNSLElBQUEsaUJBQVMsR0FBRSxDQUFDO1lBQ1osTUFBTTtRQUVSLEtBQUssSUFBSTtZQUNQLElBQUEsZ0JBQVEsR0FBRSxDQUFDO1lBQ1gsTUFBTTtRQUVSLEtBQUssT0FBTztZQUNWLElBQUEsbUJBQVcsR0FBRSxDQUFDO1lBQ2QsTUFBTTtRQUVSLEtBQUssUUFBUTtZQUNYLElBQUEsb0JBQVksR0FBRSxDQUFDO1lBQ2YsTUFBTTtRQUVSO1lBQ0UsSUFBQSxnQkFBUSxHQUFFLENBQUM7WUFDWCxJQUFBLG1CQUFXLEdBQUUsQ0FBQztZQUNkLElBQUEsb0JBQVksR0FBRSxDQUFDO1lBQ2YsSUFBQSxpQkFBUyxHQUFFLENBQUM7WUFDWixNQUFNO0tBQ1Q7QUFDSCxDQUFDLENBQ0Y7SUFDRCxXQUFXO0tBQ1YsT0FBTyxDQUNOLFFBQVEsRUFDUixzQkFBc0IsRUFDdEIsY0FBTyxDQUFDLEVBQ1I7SUFDRSxJQUFJLFFBQVEsSUFBSSxpQkFBTTtRQUNwQixJQUFJLE1BQU0sSUFBSSxpQkFBTSxDQUFDLE1BQU0sRUFBRTtZQUMzQixrQkFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsaUJBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pEO0FBQ0wsQ0FBQyxDQUNGO0lBQ0QsY0FBYztLQUNiLE9BQU8sQ0FDTixhQUFhLEVBQ2Isd0JBQXdCLEVBQ3hCLFVBQUMsS0FBSztJQUNKLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO1FBQzNCLElBQUksRUFBRSxRQUFRO1FBQ2QsUUFBUSxFQUFFLGdDQUFnQztLQUMzQyxDQUFDLENBQUM7QUFDTCxDQUFDLEVBQ0QsVUFBQyxFQUFPO1FBQUwsR0FBRyxTQUFBO0lBQ0osUUFBUSxHQUFHLEVBQUU7UUFDWCxLQUFLLFVBQVU7WUFDYixJQUFBLHFDQUFvQixFQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLE1BQU07UUFFUjtZQUNFLElBQUEscUNBQW9CLEVBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsTUFBTTtLQUNUO0FBQ0gsQ0FBQyxDQUNGO0tBQ0EsTUFBTSxDQUFDLFNBQVMsRUFBRTtJQUNqQixRQUFRLEVBQUUsZUFBZTtJQUN6QixZQUFZLEVBQUUsS0FBSztDQUNwQixDQUFDO0tBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNaLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0tBQ2xCLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO0tBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMifQ==