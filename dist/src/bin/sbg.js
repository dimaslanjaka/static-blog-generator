#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var gulpfile_1 = __importDefault(require("../../gulpfile"));
var argv = (0, yargs_1.default)(process.argv.slice(2)).argv;
var tasks = argv['_'];
//console.log(getConfig().verbose, getConfig().generator.cache);
var taskswrapper = [];
for (var i = 0; i < tasks.length; i++) {
    var taskname = tasks[i];
    var taskfn = gulpfile_1.default.task(taskname);
    //console.log('typeof task', taskname, typeof taskfn);
    if (typeof taskfn == 'function') {
        taskswrapper.push(taskfn);
    }
}
var keeprunning = true;
while (keeprunning !== false) {
    if (taskswrapper.length > 0) {
        var fn = taskswrapper[0];
        taskswrapper.shift();
        if (taskswrapper.length > 0) {
            fn(function () { return taskswrapper[0](null); });
            taskswrapper.shift();
        }
        else {
            fn(null);
            keeprunning = false;
        }
    }
    else {
        keeprunning = false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2JnLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2Jpbi9zYmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0EsZ0RBQTBCO0FBQzFCLDREQUFrQztBQUVsQyxJQUFNLElBQUksR0FBRyxJQUFBLGVBQUssRUFBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUMvQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFeEIsZ0VBQWdFO0FBRWhFLElBQU0sWUFBWSxHQUEwQixFQUFFLENBQUM7QUFDL0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDckMsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLElBQU0sTUFBTSxHQUFHLGtCQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLHNEQUFzRDtJQUN0RCxJQUFJLE9BQU8sTUFBTSxJQUFJLFVBQVUsRUFBRTtRQUMvQixZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNCO0NBQ0Y7QUFFRCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDdkIsT0FBTyxXQUFXLEtBQUssS0FBSyxFQUFFO0lBQzVCLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDM0IsSUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQixJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLEVBQUUsQ0FBQyxjQUFNLE9BQUEsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUM7WUFDaEMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3RCO2FBQU07WUFDTCxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDVCxXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO0tBQ0Y7U0FBTTtRQUNMLFdBQVcsR0FBRyxLQUFLLENBQUM7S0FDckI7Q0FDRiJ9