"use strict";
//process.stdin.resume(); //so the program will not close instantly
Object.defineProperty(exports, "__esModule", { value: true });
//const fns1: Array<(data?: string) => void> = [];
var fns = [];
/**
 * Handler function on process exit
 * @param options
 * @param exitCode
 */
function exitHandler(options, exitCode) {
    Object.keys(fns).forEach(function (key) {
        console.log("executing function key: " + key);
        fns[key]();
    });
    if (options.cleanup)
        console.log("clean");
    if (exitCode || exitCode === 0)
        console.log(exitCode);
    if (options.exit)
        process.exit();
}
var triggered;
/**
 * Bind functions to exit handler
 * @param key
 * @param fn
 */
function bindProcessExit(key, fn) {
    fns[key] = fn;
    // trigger once
    if (!triggered) {
        triggered = true;
        triggerProcess();
    }
}
// trigger process Bindings
function triggerProcess() {
    //do something when app is closing
    process.on("exit", exitHandler.bind(null, { cleanup: true }));
    //catches ctrl+c event
    process.on("SIGINT", exitHandler.bind(null, { exit: true }));
    // catches "kill pid" (for example: nodemon restart)
    process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
    process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
    //catches uncaught exceptions
    process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}
exports.default = bindProcessExit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW51cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2hleG8tc2VvL3NyYy91dGlscy9jbGVhbnVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtRUFBbUU7O0FBRW5FLGtEQUFrRDtBQUNsRCxJQUFNLEdBQUcsR0FBaUQsRUFBRSxDQUFDO0FBRTdEOzs7O0dBSUc7QUFDSCxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsUUFBUTtJQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7UUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBMkIsR0FBSyxDQUFDLENBQUM7UUFDOUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7SUFDYixDQUFDLENBQUMsQ0FBQztJQUNILElBQUksT0FBTyxDQUFDLE9BQU87UUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLElBQUksUUFBUSxJQUFJLFFBQVEsS0FBSyxDQUFDO1FBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxJQUFJLE9BQU8sQ0FBQyxJQUFJO1FBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ25DLENBQUM7QUFFRCxJQUFJLFNBQVMsQ0FBQztBQUNkOzs7O0dBSUc7QUFDSCxTQUFTLGVBQWUsQ0FBQyxHQUFXLEVBQUUsRUFBYztJQUNsRCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2QsZUFBZTtJQUNmLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGNBQWMsRUFBRSxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQztBQUVELDJCQUEyQjtBQUMzQixTQUFTLGNBQWM7SUFDckIsa0NBQWtDO0lBQ2xDLE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU5RCxzQkFBc0I7SUFDdEIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTdELG9EQUFvRDtJQUNwRCxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUQsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTlELDZCQUE2QjtJQUM3QixPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBRUQsa0JBQWUsZUFBZSxDQUFDIn0=