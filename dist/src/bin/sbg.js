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
var assets_1 = require("../gulp/tasks/copy/assets");
var posts_1 = require("../gulp/tasks/copy/posts");
var remove_inline_style_1 = require("../gulp/tasks/copy/remove-inline-style");
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
        //config[<string>key] = value;
        var configPath = (0, path_1.join)(process.cwd(), '_config.yml');
        if ((0, fs_1.existsSync)(configPath)) {
            var parse = (0, yaml_1.yamlParse)(configPath);
            parse[key] = value;
            if (_config_1.verbose)
                console.log("property ".concat(color_1.default.greenBright(key), " settled"), _config_1.default[key]);
            (0, filemanager_1.write)((0, path_1.join)(process.cwd(), '_config.cached.yml'), (0, yaml_1.yamlBuild)(parse));
        }
    }
    else {
        yargs_1.default.showHelp();
    }
})
    .command('copy', "copy all source assets and posts to ".concat(_config_1.default.source_dir, "/_posts"), function (yargs) {
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
}, function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var i, task, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                i = 0;
                _b.label = 1;
            case 1:
                if (!(i < args._.length)) return [3 /*break*/, 11];
                task = args._[i];
                if (task === 'copy')
                    return [3 /*break*/, 10];
                _a = task;
                switch (_a) {
                    case 'posts': return [3 /*break*/, 2];
                    case 'assets': return [3 /*break*/, 3];
                    case 'remove-inline-style': return [3 /*break*/, 5];
                    case 'blogger': return [3 /*break*/, 7];
                }
                return [3 /*break*/, 9];
            case 2:
                (0, posts_1.copyPosts)();
                return [3 /*break*/, 10];
            case 3: return [4 /*yield*/, (0, assets_1.copyAssets)()];
            case 4:
                _b.sent();
                return [3 /*break*/, 10];
            case 5: return [4 /*yield*/, (0, remove_inline_style_1.gulpInlineStyle)()];
            case 6:
                _b.sent();
                return [3 /*break*/, 10];
            case 7: return [4 /*yield*/, (0, assets_1.copyAssets)()];
            case 8:
                _b.sent();
                (0, posts_1.copyPosts)().on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, remove_inline_style_1.gulpInlineStyle)()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 10];
            case 9: return [3 /*break*/, 10];
            case 10:
                i++;
                return [3 /*break*/, 1];
            case 11: return [2 /*return*/];
        }
    });
}); })
    .help('help')
    .wrap(null).argv;
//gulp.series(...tasks); //(null);
/*
function _loop_method() {
  const taskswrapper: TaskFunctionWrapped[] = [];
  for (let i = 0; i < tasks.length; i++) {
    const taskname = tasks[i];
    const taskfn = gulp.task(taskname);
    //console.log('typeof task', taskname, typeof taskfn);
    if (typeof taskfn == 'function') {
      taskswrapper.push(taskfn);
    }
  }

  let keeprunning = true;
  while (keeprunning !== false) {
    if (taskswrapper.length > 0) {
      taskswrapper[0](null);
      taskswrapper.shift();
    } else {
      keeprunning = false;
    }
  }
}
*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2JnLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2Jpbi9zYmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyQ0FBMkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFM0MseUJBQWdDO0FBQ2hDLDZCQUE0QjtBQUM1QixnREFBMEI7QUFDMUIsb0RBQXVEO0FBQ3ZELGtEQUFxRDtBQUNyRCw4RUFBeUU7QUFDekUsd0RBQWtDO0FBQ2xDLG1EQUE0QztBQUM1Qyx1Q0FBc0Q7QUFDdEQsMERBQWtFO0FBRWxFLGVBQUs7S0FDRixVQUFVLENBQUMsS0FBSyxDQUFDO0tBQ2pCLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztLQUM3QixPQUFPLENBQ04sSUFBSSxFQUNKLHFCQUFxQixFQUNyQixjQUFPLENBQUMsRUFDUjtJQUNFLGVBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNuQixDQUFDLENBQ0Y7S0FDQSxPQUFPLENBQ04sV0FBVyxFQUNYLGVBQWUsRUFDZixVQUFVLEtBQUs7SUFDYixLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRTtRQUN0QixJQUFJLEVBQUUsUUFBUTtRQUNkLFFBQVEsRUFBRSxlQUFlO0tBQzFCLENBQUMsQ0FBQztBQUNMLENBQUMsRUFDRCxVQUFDLEVBQU87UUFBTCxHQUFHLFNBQUE7SUFDSixJQUFJLEdBQUcsRUFBRTtRQUNQLElBQUksaUJBQU0sQ0FBUyxHQUFHLENBQUMsRUFBRTtZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFNLENBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNsQzthQUFNO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FDVCxtQkFBWSxlQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyw2QkFBMEIsQ0FDM0QsQ0FBQztTQUNIO0tBQ0Y7U0FBTTtRQUNMLGVBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztL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