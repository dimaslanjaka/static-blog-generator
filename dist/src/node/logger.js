"use strict";
/* eslint-disable prefer-rest-params */
Object.defineProperty(exports, "__esModule", { value: true });
//const original = console;
var logger = {
    /**
     * false to deactivate logger
     */
    active: true,
    assert: function () {
        if (logger.active && logger.doAssert) {
            console.assert.apply(null, arguments);
        }
    },
    clear: function () {
        if (logger.active && logger.doClear) {
            console.clear();
        }
    },
    count: function () {
        if (logger.active && logger.doCount) {
            console.count.apply(null, arguments);
        }
    },
    countReset: function () {
        if (logger.active && logger.doCountReset) {
            console.countReset.apply(null, arguments);
        }
    },
    debug: function () {
        if (logger.active && logger.doDebug) {
            console.debug.apply(null, arguments);
        }
    },
    dir: function () {
        if (logger.active && logger.doDir) {
            console.dir.apply(null, arguments);
        }
    },
    dirxml: function () {
        if (logger.active && logger.doDirxml) {
            console.dirxml.apply(null, arguments);
        }
    },
    error: function () {
        if (logger.active && logger.doError) {
            console.error.apply(null, arguments);
        }
    },
    group: function () {
        if (logger.active && logger.doGroup) {
            console.group.apply(null, arguments);
        }
    },
    groupCollapsed: function () {
        if (logger.active && logger.doGroup) {
            console.groupCollapsed.apply(null, arguments);
        }
    },
    groupEnd: function () {
        if (logger.active && logger.doGroup) {
            console.groupEnd.apply(null, arguments);
        }
    },
    info: function () {
        if (logger.active && logger.doInfo) {
            console.info.apply(null, arguments);
        }
    },
    log: function () {
        if (logger.active && logger.doLog) {
            console.log.apply(null, arguments);
        }
    },
    table: function () {
        if (logger.active && logger.doTable) {
            console.table.apply(null, arguments);
        }
    },
    time: function () {
        if (logger.active && logger.doTime) {
            console.time.apply(null, arguments);
        }
    },
    timeEnd: function () {
        if (logger.active && logger.doTime) {
            console.timeEnd.apply(null, arguments);
        }
    },
    timeLog: function () {
        if (logger.active && logger.doTime) {
            console.timeLog.apply(null, arguments);
        }
    },
    trace: function () {
        if (logger.active && logger.doTrace) {
            console.trace.apply(null, arguments);
        }
    },
    warn: function () {
        if (logger.active && logger.doWarn) {
            console.warn.apply(null, arguments);
        }
    },
    doAssert: true,
    doClear: true,
    doCount: true,
    doCountReset: true,
    doDebug: true,
    doDir: true,
    doDirxml: true,
    doError: true,
    doGroup: true,
    doInfo: true,
    doLog: true,
    doTable: true,
    doTime: true,
    doTrace: true,
    doWarn: true,
    timeStamp: function (label) {
        return console.timeStamp(label);
    },
    Console: undefined,
    profile: function (label) {
        return console.profile(label);
    },
    profileEnd: function (label) {
        return console.profileEnd(label);
    }
};
exports.default = logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL25vZGUvbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7O0FBRXZDLDJCQUEyQjtBQUMzQixJQUFNLE1BQU0sR0FBRztJQUNiOztPQUVHO0lBQ0gsTUFBTSxFQUFFLElBQUk7SUFDWixNQUFNLEVBQUU7UUFDTixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUNwQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDbkMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQztJQUNELEtBQUssRUFBRTtRQUNMLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1lBQ25DLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztTQUN0QztJQUNILENBQUM7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtZQUN4QyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDbkMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQztJQUNELEdBQUcsRUFBRTtRQUNILElBQUksTUFBTSxD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