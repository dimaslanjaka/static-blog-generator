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
    var configDeploy, host, CNAME, e1_1, e2_1, hasSubmodule;
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
                if (!(0, fs_1.existsSync)(deployDir))
                    (0, filemanager_1.mkdirSync)(deployDir);
                if (!!(0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.git'))) return [3 /*break*/, 2];
                console.log(logname, 'init new git with current configuration', configDeploy);
                return [4 /*yield*/, (0, git_1.default)('init')];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: 
            // setup merge on pull strategy
            return [4 /*yield*/, (0, git_1.default)({ stdio: 'ignore' }, 'config', 'pull.rebase', 'false')];
            case 3:
                // setup merge on pull strategy
                _a.sent();
                // setup end of line LF
                // https://stackoverflow.com/a/13154031
                return [4 /*yield*/, (0, git_1.default)({ stdio: 'ignore' }, 'config', 'core.autocrlf', 'false')];
            case 4:
                // setup end of line LF
                // https://stackoverflow.com/a/13154031
                _a.sent();
                // add CNAME if hostname settled
                if ('host' in configDeploy || 'hostname' in configDeploy) {
                    host = configDeploy['host'] || configDeploy['hostname'];
                    if (typeof host === 'string') {
                        CNAME = (0, filemanager_1.join)(deployDir, 'CNAME');
                        (0, filemanager_1.write)(CNAME, host);
                    }
                }
                if (!('name' in configDeploy || 'username' in configDeploy)) return [3 /*break*/, 6];
                console.log(logname, 'user name found, setting up...');
                return [4 /*yield*/, (0, git_1.default)({ stdio: 'ignore' }, 'config', 'user.name', configDeploy['name'] || configDeploy['username'])];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!('email' in configDeploy)) return [3 /*break*/, 8];
                console.log(logname, 'user email found, setting up...');
                return [4 /*yield*/, (0, git_1.default)({ stdio: 'ignore' }, 'config', 'user.email', configDeploy['email'])];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                if (!('gc' in configDeploy &&
                    configDeploy['gc'] &&
                    (0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.git')))) return [3 /*break*/, 10];
                return [4 /*yield*/, (0, git_1.default)('gc', '--aggressive', '--prune')];
            case 9:
                _a.sent();
                _a.label = 10;
            case 10:
                _a.trys.push([10, 12, , 17]);
                return [4 /*yield*/, (0, git_1.default)({ stdio: 'ignore' }, 'remote', 'add', 'origin', configDeploy['repo'])];
            case 11:
                _a.sent();
                return [3 /*break*/, 17];
            case 12:
                e1_1 = _a.sent();
                _a.label = 13;
            case 13:
                _a.trys.push([13, 15, , 16]);
                return [4 /*yield*/, (0, git_1.default)({ stdio: 'ignore' }, 'remote', 'set-url', 'origin', configDeploy['repo'])];
            case 14:
                _a.sent();
                return [3 /*break*/, 16];
            case 15:
                e2_1 = _a.sent();
                if (e1_1 instanceof Error)
                    console.log('error add origin', e1_1);
                if (e2_1 instanceof Error)
                    console.log('error set-url origin', e2_1);
                return [3 /*break*/, 16];
            case 16: return [3 /*break*/, 17];
            case 17:
                // fetch all
                console.log(logname, 'fetch --all');
                return [4 /*yield*/, (0, git_1.default)('fetch', '--all')];
            case 18:
                _a.sent();
                // reset latest origin https://stackoverflow.com/a/8888015/6404439
                console.log(logname, 'reset from latest origin/' + configDeploy['branch']);
                return [4 /*yield*/, (0, git_1.default)('reset', '--hard', 'origin/' + configDeploy['branch'])];
            case 19:
                _a.sent();
                // checkout origin branch
                console.log(logname, 'checkout ' + configDeploy['branch']);
                return [4 /*yield*/, (0, git_1.default)('checkout', '-f', configDeploy['branch'])];
            case 20:
                _a.sent();
                // pull origin
                return [4 /*yield*/, (0, git_1.default)('pull', 'origin', configDeploy['branch'])];
            case 21:
                // pull origin
                _a.sent();
                hasSubmodule = (0, fs_1.existsSync)((0, filemanager_1.join)(deployDir, '.gitmodules'));
                if (!hasSubmodule) return [3 /*break*/, 23];
                console.log(logname, 'submodule found, updating...');
                return [4 /*yield*/, (0, git_1.default)('submodule', 'update', '-i', '-r')];
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
                                return [4 /*yield*/, (0, git_1.default)('add', '-A')];
                            case 2:
                                _c.sent();
                                console.log(logname, 'comitting...');
                                msg = 'Update site';
                                if (!(0, fs_1.existsSync)((0, filemanager_1.join)(process.cwd(), '.git'))) return [3 /*break*/, 4];
                                _a = msg;
                                _b = ' ';
                                return [4 /*yield*/, (0, git_1.getLatestCommitHash)()];
                            case 3:
                                msg = _a + (_b + (_c.sent()));
                                _c.label = 4;
                            case 4:
                                msg += '\ndate: ' + (0, date_1.modMoment)().format();
                                return [4 /*yield*/, (0, git_1.default)('commit', '-m', msg)];
                            case 5:
                                _c.sent();
                                console.log(logname, "pushing ".concat(configDeploy['branch'], "..."));
                                if (!(Object.hasOwnProperty.call(configDeploy, 'force') &&
                                    configDeploy['force'] === true)) return [3 /*break*/, 7];
                                return [4 /*yield*/, (0, git_1.default)('push', '-u', configDeploy['repo'], 'origin', configDeploy['branch'], '--force')];
                            case 6:
                                _c.sent();
                                return [3 /*break*/, 9];
                            case 7: return [4 /*yield*/, (0, git_1.default)('push', '--set-upstream', 'origin', configDeploy['branch'])];
                            case 8:
                                _c.sent();
                                _c.label = 9;
                            case 9:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZGVwbG95L2dpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGdEQUEwQjtBQUMxQix5QkFBZ0M7QUFDaEMsOENBQXdCO0FBRXhCLDhEQUF3QztBQUN4Qyx5REFBNEU7QUFDNUUsdURBQTZEO0FBQzdELHVEQUEyRDtBQUMzRCxnRUFBb0U7QUFDcEUsK0NBQThDO0FBRTlDLElBQU0sU0FBUyxHQUFHLElBQUEscUJBQU8sRUFBQyxJQUFBLGtCQUFJLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDOUQsSUFBTSxPQUFPLEdBQUcsZUFBSyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVyRCxJQUFNLGFBQWEsR0FBRztJQUNwQixPQUFPLGNBQUk7U0FDUixHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsNEJBQWtCLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1NBQ25FLElBQUksQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNJLElBQU0sV0FBVyxHQUFHLFVBQU8sSUFBbUI7Ozs7O2dCQUNuRCxvQ0FBb0M7Z0JBQ3BDLElBQUksQ0FBQyxJQUFBLGVBQVUsRUFBQyxTQUFTLENBQUM7b0JBQUUsSUFBQSx1QkFBUyxFQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUUzQyxZQUFZLEdBQUcsaUJBQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ25DLElBQ0UsT0FBTyxZQUFZLEtBQUssUUFBUTtvQkFDaEMsWUFBWSxLQUFLLElBQUk7b0JBQ3JCLE1B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