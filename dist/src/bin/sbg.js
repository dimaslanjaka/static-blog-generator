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
    .option('nocache', {
    describe: 'disable cache',
    demandOption: false
})
    .help('help')
    .alias('help', 'h')
    .alias('help', '?')
    .wrap(null).argv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2JnLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2Jpbi9zYmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyQ0FBMkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFM0MseUJBQWdDO0FBQ2hDLDZCQUE0QjtBQUM1QixnREFBMEI7QUFDMUIsNERBQWtDO0FBQ2xDLDZDQUs2QjtBQUM3QixvREFBdUQ7QUFDdkQsa0RBQXFEO0FBQ3JELDhFQUF5RTtBQUN6RSxpRUFBK0Q7QUFDL0QsNkRBQTREO0FBQzVELCtEQUE2RDtBQUM3RCxxRUFBbUU7QUFDbkUsd0RBQWtDO0FBQ2xDLG1EQUE0QztBQUM1Qyx1Q0FBc0Q7QUFDdEQsMERBQWtFO0FBRWxFLGVBQUs7S0FDRixVQUFVLENBQUMsS0FBSyxDQUFDO0tBQ2pCLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztLQUM3QixPQUFPLENBQ04sSUFBSSxFQUNKLHFCQUFxQixFQUNyQixjQUFPLENBQUMsRUFDUjtJQUNFLGVBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNuQixDQUFDLENBQ0Y7S0FDQSxPQUFPLENBQ04sV0FBVyxFQUNYLGVBQWUsRUFDZixVQUFVLEtBQUs7SUFDYixLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRTtRQUN0QixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxlQUFlO0tBQzFCLENBQUMsQ0FBQztBQUNMLENBQUMsRUFDRCxVQUFDLEVBQU87UUFBTCxHQUFHLFNBQUE7SUFDSixJQUFJLEdBQUcsRUFBRTtRQUNQLElBQUksaUJBQU0sQ0FBUyxHQUFHLENBQUMsRUFBRTtZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFNLENBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNsQzthQUFNO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FDVCxtQkFBWSxlQUFLLENBQUMsU0FBUyxD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