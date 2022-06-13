#!/usr/bin/env node
"use strict";
// compiled location in dist/src/bin/sbg.js
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var gulpfile_1 = __importDefault(require("../../gulpfile"));
var argv = (0, yargs_1.default)(process.argv.slice(2)).argv;
var tasks = argv['_'];
//console.log(getConfig().verbose, getConfig().generator.cache);
//console.log(argv['paths']);
gulpfile_1.default.series.apply(gulpfile_1.default, __spreadArray([], __read(tasks), false))(null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2JnLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2Jpbi9zYmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyQ0FBMkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUUzQyxnREFBMEI7QUFDMUIsNERBQWtDO0FBRWxDLElBQU0sSUFBSSxHQUFHLElBQUEsZUFBSyxFQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQy9DLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV4QixnRUFBZ0U7QUFDaEUsNkJBQTZCO0FBRTdCLGtCQUFJLENBQUMsTUFBTSxPQUFYLGtCQUFJLDJCQUFXLEtBQUssV0FBRSxJQUFJLENBQUMsQ0FBQztBQUU1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXNCRSJ9