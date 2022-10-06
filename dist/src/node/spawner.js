"use strict";
// noinspection DuplicatedCode
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var process_1 = __importDefault(require("process"));
var scheduler_1 = __importDefault(require("./scheduler"));
var spawner = /** @class */ (function () {
    function spawner() {
    }
    /**
     * promises spawn
     * @param options
     * @param cmd
     * @param args
     * @returns
     * @example
     * spawner.promise({}, 'git', 'log', '-n', '1').then(console.log);
     * spawner.promise({stdio:'pipe'}, 'git', 'submodule', 'status').then(console.log);
     */
    spawner.promise = function (options, cmd) {
        if (options === void 0) { options = null; }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            if (options === null)
                options = {
                    cwd: __dirname,
                    stdio: 'inherit'
                };
            var stdouts = [];
            var stderrs = [];
            var child = (0, cross_spawn_1.default)(cmd, args, options);
            // use event hooks to provide a callback to execute when data are available:
            if (child.stdout !== null)
                child.stdout.on('data', function (data) {
                    stdouts.push(data.toString().trim());
                });
            if (child.stderr !== null)
                child.stderr.on('data', function (data) {
                    stderrs.push(data.toString().trim());
                });
            child.on('close', function (code) {
                // Should probably be 'exit', not 'close'
                // *** Process completed
                return resolve({
                    code: code,
                    stdout: stdouts.length > 0 ? stdouts : child.stdout,
                    stderr: stderrs.length > 0
                        ? stderrs
                        : stdouts.length === 0
                            ? child.stderr
                            : null
                });
            });
            child.on('error', function (err) {
                // *** Process creation failed
                return reject({ args: args, err: err });
            });
        });
    };
    /**
     * Spawn Commands
     * @param command node
     * @param args ['index.js']
     * @param callback callback for children process
     */
    // eslint-disable-next-line no-unused-vars
    spawner.spawn = function (command, args, opt, callback) {
        if (opt === void 0) { opt = {}; }
        var defaultOption = { stdio: 'pipe', detached: false };
        if (['npm', 'ts-node', 'tsc', 'npx', 'hexo'].includes(command)) {
            command = /^win/i.test(process_1.default.platform) ? "".concat(command, ".cmd") : command;
        }
        var child = (0, cross_spawn_1.default)(command, args, Object.assign(defaultOption, opt));
        child.unref();
        child.stdout.setEncoding('utf8');
        child.stdout.on('data', function (data) {
            process_1.default.stdout.write(data);
        });
        child.stderr.setEncoding('utf8');
        child.stderr.on('data', function (data) {
            process_1.default.stdout.write(data);
        });
        child.stdin.on('data', function (data) {
            process_1.default.stdout.write(data);
        });
        if (typeof callback == 'function') {
            callback(child);
        }
        spawner.children.push(child);
        console.log("Child Process ".concat(spawner.children.length));
        if (!this.onExit) {
            scheduler_1.default.add('spawner', spawner.children_kill);
            /*this.onExit = true;
            console.log('registering children killer');
            process.on('exit', function () {
              console.log('Finished', new Date().getTime());
              spawner.children_kill();
            });
            process.on('uncaughtException', spawner.children_kill);
            process.on('SIGINT', spawner.children_kill);
            process.on('SIGTERM', spawner.children_kill);
            process.on('SIGKILL', spawner.children_kill);*/
        }
        return child;
    };
    /**
     * Kill all ChildProcessWithoutNullStreams[]
     */
    spawner.children_kill = function () {
        console.log('killing', spawner.children.length, spawner.children.length > 1 ? 'child processes' : 'child process');
        for (var i = 0; i < spawner.children.length; i++) {
            var child = spawner.children[i];
            if (typeof child != 'undefined') {
                child.kill();
                console.log("Child ".concat(child.pid, " killed ").concat(child.killed));
                delete spawner.children[i];
            }
        }
    };
    spawner.children = [];
    spawner.onExit = false;
    return spawner;
}());
exports.default = spawner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bhd25lci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ub2RlL3NwYXduZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7Ozs7QUFPOUIsNERBQWdDO0FBQ2hDLG9EQUE4QjtBQUU5QiwwREFBb0M7QUFFcEM7SUFBQTtJQTZJQSxDQUFDO0lBeklDOzs7Ozs7Ozs7T0FTRztJQUNJLGVBQU8sR0FBZCxVQUNFLE9BQW1DLEVBQ25DLEdBQVc7UUFEWCx3QkFBQSxFQUFBLGNBQW1DO1FBRW5DLGNBQWlCO2FBQWpCLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtZQUFqQiw2QkFBaUI7O1FBRWpCLE9BQU8sSUFBSSxPQUFPLENBQ2hCLFVBQ0UsT0FJUyxFQUNULE1BQTJEO1lBRTNELElBQUksT0FBTyxLQUFLLElBQUk7Z0JBQ2xCLE9BQU8sR0FBRztvQkFDUixHQUFHLEVBQUUsU0FBUztvQkFDZCxLQUFLLEVBQUUsU0FBUztpQkFDakIsQ0FBQztZQUNKLElBQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztZQUM3QixJQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7WUFDN0IsSUFBTSxLQUFLLEdBQUcsSUFBQSxxQkFBSyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDeEMsNEVBQTRFO1lBQzVFLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJO2dCQUN2QixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxJQUFJO29CQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNMLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJO2dCQUN2QixLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxJQUFJ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