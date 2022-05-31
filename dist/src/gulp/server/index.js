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
exports.localServer = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var browser_sync_1 = require("browser-sync");
var cross_port_killer_1 = require("cross-port-killer");
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var gulp_1 = __importDefault(require("gulp"));
var memoizee_1 = __importDefault(require("memoizee"));
var net_1 = __importDefault(require("net"));
var upath_1 = require("upath");
var _config_1 = __importDefault(require("../../types/_config"));
var middleware_1 = require("./middleware");
var cwd = (0, memoizee_1.default)(function () { return (0, upath_1.toUnix)(process.cwd()); });
var browserSync = (0, browser_sync_1.create)();
var portInUse = function (port, callback) {
    var server = net_1.default.createServer(function (socket) {
        socket.write('Echo server\r\n');
        socket.pipe(socket);
    });
    server.on('error', function (_e) {
        callback(true);
    });
    server.on('listening', function (_e) {
        server.close();
        callback(false);
    });
    server.listen(port, '127.0.0.1');
};
var options = {
    server: './' + _config_1.default.public_dir,
    port: _config_1.default !== null &&
        typeof _config_1.default === 'object' &&
        'server' in _config_1.default &&
        'port' in _config_1.default.server
        ? _config_1.default['server']['port']
        : 4000,
    open: false,
    middleware: middleware_1.ServerMiddleWare
};
function startServer() {
    var bsi = browserSync.init(options);
    // Listen for the `init` event
    /*bsi.emitter.on('init', function () {
      console.log('Browsersync is running!');
      middlewareCopyAssets();
    });*/
    // handling spawner to reduce memory usages
    var childs = {
        generate: [],
        copy: []
    };
    // watch changes on source dir
    gulp_1.default.watch((0, upath_1.join)(_config_1.default.source_dir, '.guid'), function (cb) {
        bluebird_1.default.all(childs.generate)
            .map(function (child) {
            if (!child.killed)
                child.kill('SIGKILL');
        })
            .then(function () {
            var child = (0, cross_spawn_1.default)('gulp', ['generate', '--nocache'], {
                cwd: cwd(),
                stdio: 'inherit'
            });
            childs.generate.push(child);
        })
            .finally(cb);
    });
    // watch changes on src-posts
    gulp_1.default.watch((0, upath_1.join)(__dirname, 'src-posts', '.guid'), function (cb) {
        bluebird_1.default.all(childs.copy)
            .map(function (child) {
            if (!child.killed)
                child.kill('SIGKILL');
        })
            .then(function () {
            var child = (0, cross_spawn_1.default)('gulp', ['copy', '--nocache'], {
                cwd: cwd(),
                stdio: 'inherit'
            });
            childs.copy.push(child);
        })
            .finally(cb);
    });
    // watch public dir/.guid to reload browsersync
    //gulp.watch(join(config.public_dir, '.guid')).on('change', browserSync.reload);
    return bsi;
}
function localServer() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, portInUse(options.port, function (inuse) { return __awaiter(_this, void 0, void 0, function () {
                    var pids;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!inuse) return [3 /*break*/, 2];
                                return [4 /*yield*/, (0, cross_port_killer_1.kill)(options.port)];
                            case 1:
                                pids = _a.sent();
                                console.log(pids, 'killed');
                                _a.label = 2;
                            case 2: return [2 /*return*/, startServer()];
                        }
                    });
                }); })];
        });
    });
}
exports.localServer = localServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvZ3VscC9zZXJ2ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0RBQWdDO0FBQ2hDLDZDQUFzRDtBQUV0RCx1REFBeUM7QUFDekMsNERBQWdDO0FBQ2hDLDhDQUF3QjtBQUN4QixzREFBZ0M7QUFDaEMsNENBQXNCO0FBQ3RCLCtCQUFxQztBQUNyQyxnRUFBeUM7QUFDekMsMkNBQWdEO0FBRWhELElBQU0sR0FBRyxHQUFHLElBQUEsa0JBQVEsRUFBQyxjQUFNLE9BQUEsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQztBQUNsRCxJQUFNLFdBQVcsR0FBRyxJQUFBLHFCQUFZLEdBQUUsQ0FBQztBQUNuQyxJQUFNLFNBQVMsR0FBRyxVQUFVLElBQVksRUFBRSxRQUFnQztJQUN4RSxJQUFNLE1BQU0sR0FBRyxhQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsTUFBTTtRQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRTtRQUM3QixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQU87UUFDdEMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2YsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxD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