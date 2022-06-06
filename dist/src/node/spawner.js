"use strict";
// noinspection DuplicatedCode
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
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
     * spawner.promise({}, 'git', 'log', '-n', '1').then((res)=> console.log(res))
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
            var child = (0, child_process_1.spawn)(cmd, args, options);
            // use event hooks to provide a callback to execute when data are available:
            if (child.stdout !== null && child.stdout !== undefined)
                child.stdout.on('data', function (data) {
                    stdouts.push(data.toString().trim());
                });
            if (child.stderr !== null && child.stderr !== undefined)
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
        var child = (0, child_process_1.spawn)(command, args, Object.assign(defaultOption, opt));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Bhd25lci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ub2RlL3NwYXduZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7Ozs7QUFFOUIsK0NBS3VCO0FBQ3ZCLG9EQUE4QjtBQUU5QiwwREFBb0M7QUFFcEM7SUFBQTtJQTRJQSxDQUFDO0lBeElDOzs7Ozs7OztPQVFHO0lBQ0ksZUFBTyxHQUFkLFVBQ0UsT0FBbUMsRUFDbkMsR0FBVztRQURYLHdCQUFBLEVBQUEsY0FBbUM7UUFFbkMsY0FBaUI7YUFBakIsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO1lBQWpCLDZCQUFpQjs7UUFFakIsT0FBTyxJQUFJLE9BQU8sQ0FDaEIsVUFDRSxPQUlTLEVBQ1QsTUFBMkQ7WUFFM0QsSUFBSSxPQUFPLEtBQUssSUFBSTtnQkFDbEIsT0FBTyxHQUFHO29CQUNSLEdBQUcsRUFBRSxTQUFTO29CQUNkLEtBQUssRUFBRSxTQUFTO2lCQUNqQixDQUFDO1lBQ0osSUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1lBQzdCLElBQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztZQUM3QixJQUFNLEtBQUssR0FBRyxJQUFBLHFCQUFLLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN4Qyw0RUFBNEU7WUFDNUUsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFNBQVM7Z0JBQ3JELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLElBQUk7b0JBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ3ZDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLFNB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