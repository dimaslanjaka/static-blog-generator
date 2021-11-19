"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.stdin.resume(); //so the program will not close instantly
//const fns1: Array<(data?: string) => void> = [];
var fns = [];
/**
 * Handler function on process exit
 * @param options
 * @param exitCode
 */
function exitHandler(options, exitCode) {
    Object.keys(fns).forEach(function (key) {
        fns[key]();
    });
    if (options.cleanup)
        console.log("clean");
    if (exitCode || exitCode === 0)
        console.log(exitCode);
    if (options.exit)
        process.exit();
}
/**
 * Bind functions to exit handler
 * @param key
 * @param fn
 */
function bindProcessExit(key, fn) {
    fns[key] = fn;
}
//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));
//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
exports.default = bindProcessExit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW51cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2hleG8tc2VvL3NyYy91dGlscy9jbGVhbnVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLHlDQUF5QztBQUVqRSxrREFBa0Q7QUFDbEQsSUFBTSxHQUFHLEdBQWlELEVBQUUsQ0FBQztBQUU3RDs7OztHQUlHO0FBQ0gsU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLFFBQVE7SUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1FBQzNCLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLE9BQU8sQ0FBQyxPQUFPO1FBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxJQUFJLFFBQVEsSUFBSSxRQUFRLEtBQUssQ0FBQztRQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEQsSUFBSSxPQUFPLENBQUMsSUFBSTtRQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuQyxDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsZUFBZSxDQUFDLEdBQVcsRUFBRSxFQUFjO0lBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDaEIsQ0FBQztBQUVELGtDQUFrQztBQUNsQyxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFOUQsc0JBQXNCO0FBQ3RCLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUU3RCxvREFBb0Q7QUFDcEQsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlELE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztBQUU5RCw2QkFBNkI7QUFDN0IsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFeEUsa0JBQWUsZUFBZSxDQUFDIn0=