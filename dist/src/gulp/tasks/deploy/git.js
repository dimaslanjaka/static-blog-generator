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
var fs_1 = require("fs");
var git_command_helper_1 = require("git-command-helper");
var gulp_1 = __importDefault(require("gulp"));
var color_1 = __importDefault(require("../../../node/color"));
var filemanager_1 = require("../../../node/filemanager");
var git_1 = __importStar(require("../../../node/git"));
var date_1 = require("../../../renderer/helpers/date");
var _config_1 = __importStar(require("../../../types/_config"));
var beforeDeploy_1 = require("./beforeDeploy");
var deployDir = (0, filemanager_1.resolve)((0, filemanager_1.join)(process.cwd(), '.deploy_git'));
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
    var configDeploy, github, host, CNAME, hasSubmodule;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // create deploy folder if not exist
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
                // create deployment working dir if not exist
                if (!(0, fs_1.existsSync)(deployDir))
                    (0, filemanager_1.mkdirSync)(deployDir);
                github = new git_command_helper_1.gitHelper(deployDir);
                if (!!(0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.git'))) return [3 /*break*/, 2];
                console.log(logname, 'init new git with current configuration', configDeploy);
                return [4 /*yield*/, github.init()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                // add CNAME if exist
                if ('host' in configDeploy || 'hostname' in configDeploy) {
                    host = configDeploy['host'] || configDeploy['hostname'];
                    if (typeof host === 'string') {
                        CNAME = (0, filemanager_1.join)(deployDir, 'CNAME');
                        (0, filemanager_1.write)(CNAME, host);
                    }
                }
                // resolve git username
                if ('name' in configDeploy || 'username' in configDeploy) {
                    console.log(logname, 'user name found, setting up...');
                    github.setuser(configDeploy['name'] || configDeploy['username']);
                }
                if ('email' in configDeploy) {
                    console.log(logname, 'user email found, setting up...');
                    github.setemail(configDeploy['email']);
                }
                if (!('gc' in configDeploy &&
                    configDeploy['gc'] &&
                    (0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.git')))) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, git_1.default)('gc', '--aggressive', '--prune')];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, github.setremote(configDeploy['repo'])];
            case 5:
                _a.sent();
                hasSubmodule = github.submodule.hasSubmodule();
                // fetch all
                console.log(logname, 'fetching...');
                return [4 /*yield*/, github.fetch(['--all'])];
            case 6:
                _a.sent();
                // reset latest origin https://stackoverflow.com/a/8888015/6404439
                console.log(logname, 'reset from latest origin/' + configDeploy['branch']);
                return [4 /*yield*/, github.reset(configDeploy['branch'])];
            case 7:
                _a.sent();
                // checkout origin branch
                console.log(logname, 'checkout ' + configDeploy['branch']);
                return [4 /*yield*/, (0, git_1.default)('checkout', '-f', configDeploy['branch'])];
            case 8:
                _a.sent();
                // pull origin with submodule and allow unrelated histories
                console.log(logname, 'pulling...');
                return [4 /*yield*/, github.pull(['--recurse-submodule', '--allow-unrelated-histories'])];
            case 9:
                _a.sent();
                /*
                if (hasSubmodule) {
                  console.log(logname, 'updating submodules...');
                  await github.submodule.update();
                }
                */
                return [2 /*return*/, copyGenerated().on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var msg, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    console.log(logname, 'processing files before deploy...');
                                    return [4 /*yield*/, (0, beforeDeploy_1.beforeDeploy)(_config_1.post_generated_dir)];
                                case 1:
                                    _c.sent();
                                    // add
                                    console.log(logname, 'adding files...');
                                    if (!hasSubmodule) return [3 /*break*/, 3];
                                    console.log(logname, 'adding submodules files...');
                                    return [4 /*yield*/, github.submodule.addAll('-A')];
                                case 2:
                                    _c.sent();
                                    _c.label = 3;
                                case 3: return [4 /*yield*/, github.add('-A')];
                                case 4:
                                    _c.sent();
                                    // commit
                                    console.log(logname, 'commiting...');
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
                                    if (!hasSubmodule) return [3 /*break*/, 8];
                                    console.log(logname, 'commiting submodules...');
                                    return [4 /*yield*/, github.submodule.commitAll(msg)];
                                case 7:
                                    _c.sent();
                                    _c.label = 8;
                                case 8: return [4 /*yield*/, github.commit(msg, '-am')];
                                case 9:
                                    _c.sent();
                                    // push
                                    console.log(logname, "pushing ".concat(configDeploy['branch'], "..."));
                                    if (Object.hasOwnProperty.call(configDeploy, 'force') &&
                                        configDeploy['force'] === true) {
                                        /*await git(
                                          'push',
                                          '-u',
                                          configDeploy['repo'],
                                          'origin',
                                          configDeploy['branch'],
                                          '--force'
                                        );*/
                                    }
                                    else {
                                        //await git('push', '--set-upstream', 'origin', configDeploy['branch']);
                                    }
                                    if (hasSubmodule) {
                                        console.log(logname, 'pushing submodules...');
                                        //await git('submodule', 'foreach', 'git', 'push');
                                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZGVwbG95L2dpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUMxQix5QkFBZ0M7QUFDaEMseURBQStDO0FBQy9DLDhDQUF3QjtBQUV4Qiw4REFBd0M7QUFDeEMseURBQTRFO0FBQzVFLHVEQUE2RDtBQUM3RCx1REFBMkQ7QUFDM0QsZ0VBQW9FO0FBQ3BFLCtDQUE4QztBQUU5QyxJQUFNLFNBQVMsR0FBRyxJQUFBLHFCQUFPLEVBQUMsSUFBQSxrQkFBSSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQzlELElBQU0sT0FBTyxHQUFHLGVBQUssQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFckQsSUFBTSxhQUFhLEdBQUc7SUFDcEIsT0FBTyxjQUFJO1NBQ1IsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLDRCQUFrQixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUNuRSxJQUFJLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLENBQUMsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSSxJQUFNLFdBQVcsR0FBRyxVQUFPLElBQW1COzs7OztnQkFDbkQsb0NBQW9DO2dCQUNwQyxJQUFJLENBQUMsSUFBQSxlQUFVLEVBQUMsU0FBUyxDQUFDO29CQUFFLElBQUEsdUJBQVMsRUFBQyxTQUFTLENBQUMsQ0FBQztnQkFFM0MsWUFBWSxHQUFHLGlCQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNuQyxJQUNFLE9BQU8sWUFBWSxLQUFLLFFBQVE7b0JBQ2hDLFlBQVksS0FBSyxJ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