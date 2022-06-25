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
exports.deployerGit = void 0;
var chalk_1 = __importDefault(require("chalk"));
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var gulp_1 = __importDefault(require("gulp"));
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var git_1 = require("../../../node/git");
var date_1 = require("../../../renderer/helpers/date");
var _config_1 = __importStar(require("../../../types/_config"));
var beforeDeploy_1 = require("./beforeDeploy");
var deployDir = (0, filemanager_1.resolve)((0, filemanager_1.join)(_config_1.root, '.deploy_git'));
/**
 * git command
 * @param args
 * @returns
 */
function git() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        var summon = (0, child_process_1.spawn)('git', args, {
            cwd: deployDir,
            stdio: 'inherit'
        });
        summon.on('close', function (code) {
            // Should probably be 'exit', not 'close'
            // *** Process completed
            return resolve({
                code: code,
                stdout: String(summon.stdout),
                stderr: String(summon.stderr)
            });
        });
        summon.on('error', function (err) {
            // *** Process creation failed
            return reject({ args: args, err: err });
        });
    });
}
var logname = chalk_1.default.magentaBright('[deploy][git]');
var copyGenerated = function () {
    return gulp_1.default
        .src(['**/**', '!**/.git*'], { cwd: _config_1.post_generated_dir, dot: true })
        .pipe(gulp_1.default.dest(deployDir));
};
/**
 * GitHub Deployer
 * @param done
 * @returns
 */
var deployerGit = function (done) { return __awaiter(void 0, void 0, void 0, function () {
    var configDeploy, host, CNAME, e1_1, e2_1, hasSubmodule;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // create deploy folder
                if (!(0, fs_1.existsSync)(deployDir))
                    (0, filemanager_1.mkdirSync)(deployDir);
                configDeploy = _config_1.default.deploy;
                if (typeof configDeploy !== 'object' ||
                    configDeploy === null ||
                    'repo' in configDeploy === false) {
                    throw new Error('incorrect deploy config');
                }
                if ('branch' in configDeploy === false) {
                    console.log(color_1.default.redBright('cannot push without branch'));
                    return [2 /*return*/];
                }
                configDeploy['base'] = deployDir;
                if (!(0, fs_1.existsSync)(deployDir))
                    (0, filemanager_1.mkdirSync)(deployDir);
                if (!!(0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.git'))) return [3 /*break*/, 2];
                console.log(logname, 'init new git with current configuration', configDeploy);
                return [4 /*yield*/, git('init')];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: 
            // setup merge on pull strategy
            return [4 /*yield*/, git('config', 'pull.rebase', 'false')];
            case 3:
                // setup merge on pull strategy
                _a.sent();
                // setup end of line LF
                // https://stackoverflow.com/a/13154031
                return [4 /*yield*/, git('git', 'config', 'core.autocrlf', 'false')];
            case 4:
                // setup end of line LF
                // https://stackoverflow.com/a/13154031
                _a.sent();
                if ('host' in configDeploy || 'hostname' in configDeploy) {
                    host = configDeploy['host'] || configDeploy['hostname'];
                    if (typeof host === 'string') {
                        CNAME = (0, filemanager_1.join)(deployDir, 'CNAME');
                        (0, filemanager_1.write)(CNAME, host);
                    }
                }
                if (!('name' in configDeploy || 'username' in configDeploy)) return [3 /*break*/, 6];
                console.log(logname, 'user name found, setting up...');
                return [4 /*yield*/, git('config', 'user.name', configDeploy['name'] || configDeploy['username'])];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!('email' in configDeploy)) return [3 /*break*/, 8];
                console.log(logname, 'user email found, setting up...');
                return [4 /*yield*/, git('config', 'user.email', configDeploy['email'])];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                if (!('gc' in configDeploy &&
                    configDeploy['gc'] &&
                    (0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.git')))) return [3 /*break*/, 10];
                return [4 /*yield*/, git('gc', '--aggressive', '--prune')];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                _a.trys.push([10, 12, , 17]);
                return [4 /*yield*/, git('remote', 'add', 'origin', configDeploy['repo'])];
            case 11:
                _a.sent();
                return [3 /*break*/, 17];
            case 12:
                e1_1 = _a.sent();
                _a.label = 13;
            case 13:
                _a.trys.push([13, 15, , 16]);
                return [4 /*yield*/, git('remote', 'set-url', 'origin', configDeploy['repo'])];
            case 14:
                _a.sent();
                return [3 /*break*/, 16];
            case 15:
                e2_1 = _a.sent();
                if (e1_1)
                    console.log('error add origin', e1_1);
                if (e2_1)
                    console.log('error set-url origin', e2_1);
                return [3 /*break*/, 16];
            case 16: return [3 /*break*/, 17];
            case 17:
                // fetch all
                console.log(logname, 'fetch --all');
                return [4 /*yield*/, git('fetch', '--all')];
            case 18:
                _a.sent();
                // reset latest origin https://stackoverflow.com/a/8888015/6404439
                console.log(logname, 'reset from latest origin/' + configDeploy['branch']);
                return [4 /*yield*/, git('reset', '--hard', 'origin/' + configDeploy['branch'])];
            case 19:
                _a.sent();
                // checkout origin branch
                console.log(logname, 'checkout ' + configDeploy['branch']);
                return [4 /*yield*/, git('checkout', '-f', configDeploy['branch'])];
            case 20:
                _a.sent();
                // pull origin
                return [4 /*yield*/, git('pull', 'origin', configDeploy['branch'])];
            case 21:
                // pull origin
                _a.sent();
                hasSubmodule = (0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.gitmodules'));
                if (!hasSubmodule) return [3 /*break*/, 23];
                console.log(logname, 'submodule found, updating...');
                return [4 /*yield*/, git('submodule', 'update', '-i', '-r')];
            case 22:
                _a.sent();
                _a.label = 23;
            case 23: return [2 /*return*/, copyGenerated().on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                    var msg, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                console.log(logname, 'processing files before deploy...');
                                return [4 /*yield*/, (0, beforeDeploy_1.beforeDeploy)(_config_1.post_generated_dir)];
                            case 1:
                                _c.sent();
                                console.log(logname, 'adding files...');
                                return [4 /*yield*/, git('add', '-A')];
                            case 2:
                                _c.sent();
                                if (!hasSubmodule) return [3 /*break*/, 4];
                                console.log(logname, 'adding submodule files...');
                                return [4 /*yield*/, git('submodule', 'foreach', 'git', 'add', '-A')];
                            case 3:
                                _c.sent();
                                _c.label = 4;
                            case 4:
                                console.log(logname, 'comitting...');
                                msg = 'Update site';
                                if (!(0, fs_1.existsSync)((0, filemanager_1.join)(process.cwd(), '.git'))) return [3 /*break*/, 6];
                                _a = msg;
                                _b = ' ';
                                return [4 /*yield*/, (0, git_1.getLatestCommitHash)()];
                            case 5:
                                msg = _a + (_b + (_c.sent()));
                                _c.label = 6;
                            case 6:
                                msg += '\ndate: ' + (0, date_1.modMoment)().format();
                                return [4 /*yield*/, git('commit', '-m', msg)];
                            case 7:
                                _c.sent();
                                if (!hasSubmodule) return [3 /*break*/, 9];
                                console.log(logname, 'comiting submodule...');
                                return [4 /*yield*/, git('submodule', 'foreach', 'git', 'commit', '-m', msg)];
                            case 8:
                                _c.sent();
                                _c.label = 9;
                            case 9:
                                if (!hasSubmodule) return [3 /*break*/, 11];
                                console.log(logname, 'pushing submodule...');
                                return [4 /*yield*/, git('submodule', 'foreach', 'git', 'push')];
                            case 10:
                                _c.sent();
                                _c.label = 11;
                            case 11:
                                console.log(logname, "pushing ".concat(configDeploy['branch'], "..."));
                                if (!(Object.hasOwnProperty.call(configDeploy, 'force') &&
                                    configDeploy['force'] === true)) return [3 /*break*/, 13];
                                return [4 /*yield*/, git('push', '-u', configDeploy['repo'], 'origin', configDeploy['branch'], '--force')];
                            case 12:
                                _c.sent();
                                return [3 /*break*/, 15];
                            case 13: return [4 /*yield*/, git('push', '--set-upstream', 'origin', configDeploy['branch'])];
                            case 14:
                                _c.sent();
                                _c.label = 15;
                            case 15:
                                console.log(logname, 'deploy merged with origin successful');
                                done();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        }
    });
}); };
exports.deployerGit = deployerGit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZGVwbG95L2dpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUMxQiwrQ0FBc0M7QUFDdEMseUJBQWdDO0FBQ2hDLDhDQUF3QjtBQUV4Qiw4REFBd0M7QUFDeEMseURBQTRFO0FBQzVFLHlDQUF3RDtBQUN4RCx1REFBMkQ7QUFDM0QsZ0VBQTBFO0FBQzFFLCtDQUE4QztBQUU5QyxJQUFNLFNBQVMsR0FBRyxJQUFBLHFCQUFPLEVBQUMsSUFBQSxrQkFBSSxFQUFDLGNBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBRXJEOzs7O0dBSUc7QUFDSCxTQUFTLEdBQUc7SUFBQyxjQUFpQjtTQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7UUFBakIseUJBQWlCOztJQUM1QixPQUFPLElBQUksT0FBTyxDQUNoQixVQUNFLE9BQXdFLEVBQ3hFLE1BQXFEO1FBRXJELElBQU0sTUFBTSxHQUFHLElBQUEscUJBQUssRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQ2hDLEdBQUcsRUFBRSxTQUFTO1lBQ2QsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJO1lBQy9CLHlDQUF5QztZQUN6Qyx3QkFBd0I7WUFDeEIsT0FBTyxPQUFPLENBQUM7Z0JBQ2IsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUM3QixNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDOUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLEdBQUc7WUFDOUIsOEJBQThCO1lBQzlCLE9BQU8sTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FDRixDQUFDO0FBQ0osQ0FBQztBQUNELElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFckQsSUFBTSxhQUFhLEdBQUc7SUFDcEIsT0FBTyxjQUFJO1NBQ1IsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLDRCQUFrQixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUNuRSxJQUFJLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLENBQUMsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSSxJQUFNLFdBQVcsR0FBRyxVQUFPLElBQW1COzs7OztnQkFDbkQsdUJBQXVCO2dCQUN2QixJQUFJLENBQUMsSUFBQSxlQUFVLEVBQUMsU0FBUyxDQUFDO29CQUFFLElBQUEsdUJBQVMsRUFBQyxTQUFTLENBQUMsQ0FBQztnQkFFM0MsWUFBWSxHQUFHLGlCQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNuQyxJQUNFLE9BQU8sWUFBWSxLQUFLLFFBQVE7b0JBQ2hDLFlBQVksS0FBSyxJQUFJO29CQUNyQixNQUFNLElBQUksWUFBWSxLQUFLLEtBQUssRUFDaEM7b0JBQ0EsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2lCQUM1QztnQkFDRCxJQUFJLFFBQVEsSUFBSSxZQUFZLEtBQUssS0FBSyxFQUFFO29CQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxzQkFBTztpQkFDUjtnQkFDRCxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsSUFBQSxlQUFVLEVBQUMsU0FBUyxDQUFDO29CQUFFLElBQUEsdUJBQVMsRUFBQyxTQUFTLENBQUMsQ0FBQztxQkFDN0MsQ0FBQyxJQUFBLGVBQVUsRUFBQyxJQUFBLGtCQUFJLEVBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQXBDLHdCQUFvQztnQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FDVCxPQUFPLEVBQ1AseUNBQXlDLEVBQ3pDLFlBQVksQ0FDYixDQUFDO2dCQUNGLHFCQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBQTs7Z0JBQWpCLFNBQWlCLENBQUM7OztZQUdwQiwrQkFBK0I7WUFDL0IscUJBQU0sR0FBRyxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLEVBQUE7O2dCQUQzQywrQkFBK0I7Z0JBQy9CLFNBQTJDLENBQUM7Z0JBQzVDLHVCQUF1QjtnQkFDdkIsdUNBQXVDO2dCQUN2QyxxQkFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLEVBQUE7O2dCQUZwRCx1QkFBdUI7Z0JBQ3ZCLHVDQUF1QztnQkFDdkMsU0FBb0QsQ0FBQztnQkFFckQsSUFBSSxNQUFNLElBQUksWUFBWSxJQUFJLFVBQVUsSUFBSSxZQUFZLEVBQUU7b0JBQ2xELElBQUksR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUM5RCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTt3QkFDdEIsS0FBSyxHQUFHLElBQUEsa0JBQUksRUFBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBQ3ZDLElBQUEsbUJBQUssRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ3BCO2lCQUNGO3FCQUdHLENBQUEsTUFBTSxJQUFJLFlBQVksSUFBSSxVQUFVLElBQUksWUFBWSxDQUFBLEVBQXBELHdCQUFvRDtnQkFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztnQkFDdkQscUJBQU0sR0FBRyxDQUNQLFFBQVEsRUFDUixXQUFXLEVBQ1gsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FDakQsRUFBQTs7Z0JBSkQsU0FJQyxDQUFDOzs7cUJBRUEsQ0FBQSxPQUFPLElBQUksWUFBWSxDQUFBLEVBQXZCLHdCQUF1QjtnQkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztnQkFDeEQscUJBQU0sR0FBRyxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUE7O2dCQUF4RCxTQUF3RCxDQUFDOzs7cUJBS3pELENBQUEsSUFBSSxJQUFJLFlBQVk7b0JBQ3BCLFlBQVksQ0FBQyxJQUFJLENBQUM7b0JBQ2xCLElBQUEsZUFBVSxFQUFDLElBQUEsa0JBQUksRUFBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQSxFQUZuQyx5QkFFbUM7Z0JBRW5DLHFCQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsQ0FBQyxFQUFBOztnQkFBMUMsU0FBMEMsQ0FBQzs7OztnQkFJM0MscUJBQU0sR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFBOztnQkFBMUQsU0FBMEQsQ0FBQzs7Ozs7OztnQkFHekQscUJBQU0sR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFBOztnQkFBOUQsU0FBOEQsQ0FBQzs7OztnQkFFL0QsSUFBSSxJQUFFO29CQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBRSxDQUFDLENBQUM7Z0JBQzVDLElBQUksSUFBRTtvQkFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixFQUFFLElBQUUsQ0FBQyxDQUFDOzs7O2dCQUlwRCxZQUFZO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUNwQyxxQkFBTSxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFBOztnQkFBM0IsU0FBMkIsQ0FBQztnQkFDNUIsa0VBQWtFO2dCQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSwyQkFBMkIsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDM0UscUJBQU0sR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFBOztnQkFBaEUsU0FBZ0UsQ0FBQztnQkFDakUseUJBQXlCO2dCQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxXQUFXLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELHFCQUFNLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFBOztnQkFBbkQsU0FBbUQsQ0FBQztnQkFDcEQsY0FBYztnQkFDZCxxQkFBTSxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQTs7Z0JBRG5ELGNBQWM7Z0JBQ2QsU0FBbUQsQ0FBQztnQkFFOUMsWUFBWSxHQUFHLElBQUEsZUFBVSxFQUFDLElBQUEsa0JBQUksRUFBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztxQkFDNUQsWUFBWSxFQUFaLHlCQUFZO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLDhCQUE4QixDQUFDLENBQUM7Z0JBQ3JELHFCQUFNLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBQTs7Z0JBQTVDLFNBQTRDLENBQUM7O3FCQUcvQyxzQkFBTyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFOzs7OztnQ0FDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztnQ0FDMUQscUJBQU0sSUFBQSwyQkFBWSxFQUFDLDRCQUFrQixDQUFDLEVBQUE7O2dDQUF0QyxTQUFzQyxDQUFDO2dDQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dDQUN4QyxxQkFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFBOztnQ0FBdEIsU0FBc0IsQ0FBQztxQ0FDbkIsWUFBWSxFQUFaLHdCQUFZO2dDQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLDJCQUEyQixDQUFDLENBQUM7Z0NBQ2xELHFCQUFNLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUE7O2dDQUFyRCxTQUFxRCxDQUFDOzs7Z0NBRXhELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dDQUNqQyxHQUFHLEdBQUcsYUFBYSxDQUFDO3FDQUNwQixJQUFBLGVBQVUsRUFBQyxJQUFBLGtCQUFJLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQXZDLHdCQUF1QztnQ0FDekMsS0FBQSxHQUFHLENBQUE7Z0NBQUksS0FBQSxHQUFHLENBQUE7Z0NBQUkscUJBQU0sSUFBQSx5QkFBbUIsR0FBRSxFQUFBOztnQ0FBekMsR0FBRyxHQUFILE1BQU8sS0FBTSxDQUFDLFNBQTJCLENBQUMsQ0FBQSxDQUFDOzs7Z0NBQzdDLEdBQUcsSUFBSSxVQUFVLEdBQUcsSUFBQSxnQkFBUyxHQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7Z0NBQ3pDLHFCQUFNLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFBOztnQ0FBOUIsU0FBOEIsQ0FBQztxQ0FDM0IsWUFBWSxFQUFaLHdCQUFZO2dDQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLHVCQUF1QixDQUFDLENBQUM7Z0NBQzlDLHFCQUFNLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFBOztnQ0FBN0QsU0FBNkQsQ0FBQzs7O3FDQUc1RCxZQUFZLEVBQVoseUJBQVk7Z0NBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQ0FDN0MscUJBQU0sR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxFQUFBOztnQ0FBaEQsU0FBZ0QsQ0FBQzs7O2dDQUVuRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxrQkFBVyxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQUssQ0FBQyxDQUFDO3FDQUUzRCxDQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUM7b0NBQ2pELFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUEsRUFEOUIseUJBQzhCO2dDQUU5QixxQkFBTSxHQUFHLENBQ1AsTUFBTSxFQUNOLElBQUksRUFDSixZQUFZLENBQUMsTUFBTSxDQUFDLEVBQ3BCLFFBQVEsRUFDUixZQUFZLENBQUMsUUFBUSxDQUFDLEVBQ3RCLFNBQVMsQ0FDVixFQUFBOztnQ0FQRCxTQU9DLENBQUM7O3FDQUVGLHFCQUFNLEdBQUcsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFBOztnQ0FBckUsU0FBcUUsQ0FBQzs7O2dDQUd4RSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxzQ0FBc0MsQ0FBQyxDQUFDO2dDQUU3RCxJQUFJLEVBQUUsQ0FBQzs7OztxQkFDUixDQUFDLEVBQUM7OztLQUNKLENBQUM7QUExSVcsUUFBQSxXQUFXLGVBMEl0QiJ9