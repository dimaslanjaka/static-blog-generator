"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpCaller = void 0;
var deepmerge_ts_1 = require("deepmerge-ts");
var filemanager_1 = require("./filemanager");
function dumpCaller(n, opt) {
    if (typeof opt == 'object')
        opt = (0, deepmerge_ts_1.deepmerge)({ lib: true }, opt);
    var e = new Error().stack
        .split(/\sat/gm)
        .map(function (s) {
        if (s.includes('node_modules')) {
            if (opt.lib) {
                s = '[lib] ' + s;
            }
            else {
                return null;
            }
        }
        // remove this function trace
        if (s.includes('dumpCaller'))
            return null;
        var re = /eval.*['"]([\w\W]*)['"]:([\d]*):([\d]*)/gm;
        if (re.test(s)) {
            var m = s.match(re);
            s = "[ejs] eval (".concat(m[1], ":").concat(m[2], ":").concat(m[3], ")");
        }
        return s.trim().replace(/\s+/, ' ');
    })
        .filter(function (s) { return typeof s == 'string' && s.includes(filemanager_1.PATH_SEPARATOR) && s.length > 0; });
    if (typeof n == 'number')
        return e[n];
    return e;
}
exports.dumpCaller = dumpCaller;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhY2UuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbm9kZS90cmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBeUM7QUFDekMsNkNBQStDO0FBYS9DLFNBQWdCLFVBQVUsQ0FBQyxDQUFVLEVBQUUsR0FBNEI7SUFDakUsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRO1FBQUUsR0FBRyxHQUFHLElBQUEsd0JBQVMsRUFBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNoRSxJQUFNLENBQUMsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUs7U0FDeEIsS0FBSyxDQUFDLFFBQVEsQ0FBQztTQUNmLEdBQUcsQ0FBQyxVQUFDLENBQUM7UUFDTCxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDOUIsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFO2dCQUNYLENBQUMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDO2FBQ2I7U0FDRjtRQUNELDZCQUE2QjtRQUM3QixJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFMUMsSUFBTSxFQUFFLEdBQUcsMkNBQTJDLENBQUM7UUFDdkQsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2QsSUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixDQUFDLEdBQUcsc0JBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQUcsQ0FBQztTQUM1QztRQUNELE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDO1NBQ0QsTUFBTSxDQUNMLFVBQUMsQ0FBQyxJQUFLLE9BQUEsT0FBTyxDQUFDLElBQUksUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsNEJBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFsRSxDQUFrRSxDQUMxRSxDQUFDO0lBQ0osSUFBSSxPQUFPLENBQUMsSUFBSSxRQUFRO1FBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEMsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBM0JELGdDQTJCQyJ9