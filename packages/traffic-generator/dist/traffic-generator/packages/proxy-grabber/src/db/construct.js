"use strict";
var tslib_1 = require("tslib");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var fm = (0, tslib_1.__importStar)(require("../../../../../hexo-seo/src/fm"));
require("../../../../../hexo-seo/packages/js-prototypes/src/Number");
var fs_1 = require("fs");
var pretty_error_1 = (0, tslib_1.__importDefault)(require("pretty-error"));
var pe = new pretty_error_1.default();
pe.start();
var DBConstructor = /** @class */ (function () {
    /**
     * Database File Constructor
     * @param folder folder to save entire databases
     */
    function DBConstructor(folder) {
        this.debug = false;
        this.folder = folder;
    }
    /**
     * check if data key on table exists
     * @param key
     * @returns
     */
    DBConstructor.prototype.exists = function (key) {
        return (0, fs_1.existsSync)(this.locationfile(key));
    };
    /**
     * add data to table
     * @param key
     * @param value
     */
    DBConstructor.prototype.push = function (key, value) {
        var content;
        content = typeof value + ':' + Buffer.from(value.toString()).toString('base64');
        if (Array.isArray(value)) {
            content = 'array:' + Buffer.from(JSON.stringify(value)).toString('base64');
        }
        else if (typeof value == 'object') {
            content = typeof value + ':' + Buffer.from(JSON.stringify(value)).toString('base64');
        }
        else if (typeof value == 'number') {
            if (isInt(value)) {
                content = 'number:' + Buffer.from(value.toString()).toString('base64');
            }
            else if (isFloat(value)) {
                content = 'float:' + Buffer.from(value.toString()).toString('base64');
            }
        }
        this.save(key, content);
    };
    DBConstructor.prototype.save = function (key, content) {
        fm.writeFile(this.locationfile(key), content);
    };
    /**
     * Edit database key
     * @param key
     * @param newValue
     * @param by
     * @returns
     */
    DBConstructor.prototype.edit = function (key, newValue, by) {
        if (typeof by == 'object') {
            var get = this.get(key);
            if (Array.isArray(get)) {
                /**
                 * get index array, if (-1) = not found
                 */
                var getIndex = get.findIndex(function (predicate) {
                    // if object by === predicate
                    if (objectEquals(predicate, by))
                        return true;
                    var keysBy = Object.keys(by);
                    var resultLoop = true;
                    for (var index = 0; index < keysBy.length; index++) {
                        var keyBy = keysBy[index];
                        // if not match, it return false (true && false)
                        resultLoop = resultLoop && predicate[keyBy] === by[keyBy];
                    }
                    if (resultLoop)
                        return true;
                });
                if (getIndex > -1) {
                    // set new value
                    get[getIndex] = newValue;
                    this.push(key, get);
                    return true;
                }
                else {
                    if (this.debug)
                        console.error('cannot find index ' + key, by);
                    return false;
                }
            }
        }
        else if (!by) {
            this.push(key, newValue);
            return true;
        }
        return false;
    };
    /**
     * get table database by key
     * @param key key table
     * @param fallback fallback value if not exists
     * @returns
     * @example
     * const nonExists = db.exists('/data-not-exists', 'default value');
     * console.log(nonExists); // default value
     */
    DBConstructor.prototype.get = function (key, fallback) {
        var ada = this.exists(key);
        if (!ada) {
            if (fallback)
                return fallback;
            return null;
        }
        var content = fm.readFile(this.locationfile(key)).toString().split(':');
        var value = Buffer.from(content[1], 'base64').toString('ascii');
        switch (content[0]) {
            case 'object':
            case 'array':
                return JSON.parse(value);
            case 'float':
                return parseFloat(value);
            case 'number':
                return parseInt(value);
            default:
                return value;
        }
    };
    DBConstructor.prototype.locationfile = function (key) {
        return path_1.default.join(this.folder, key);
    };
    return DBConstructor;
}());
function objectEquals(x, y) {
    'use strict';
    if (x === null || x === undefined || y === null || y === undefined) {
        return x === y;
    }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {
        return false;
    }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) {
        return x === y;
    }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) {
        return x === y;
    }
    if (x === y || x.valueOf() === y.valueOf()) {
        return true;
    }
    if (Array.isArray(x) && x.length !== y.length) {
        return false;
    }
    // if they are dates, they must had equal valueOf
    if (x instanceof Date) {
        return false;
    }
    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) {
        return false;
    }
    if (!(y instanceof Object)) {
        return false;
    }
    // recursive object equality check
    var p = Object.keys(x);
    return (Object.keys(y).every(function (i) {
        return p.indexOf(i) !== -1;
    }) &&
        p.every(function (i) {
            return objectEquals(x[i], y[i]);
        }));
}
module.exports = DBConstructor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcHJveHktZ3JhYmJlci9zcmMvZGIvY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkRBQXdCO0FBQ3hCLDhFQUFxRDtBQUNyRCxxRUFBbUU7QUFDbkUseUJBQWdDO0FBQ2hDLDJFQUF1QztBQUN2QyxJQUFNLEVBQUUsR0FBRyxJQUFJLHNCQUFXLEVBQUUsQ0FBQztBQUM3QixFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFFWDtJQUdFOzs7T0FHRztJQUNILHVCQUFZLE1BQWM7UUFMMUIsVUFBSyxHQUFHLEtBQUssQ0FBQztRQU1aLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFDRDs7OztPQUlHO0lBQ0gsOEJBQU0sR0FBTixVQUFPLEdBQVc7UUFDaEIsT0FBTyxJQUFBLGVBQVUsRUFBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCw0QkFBSSxHQUFKLFVBQUssR0FBVyxFQUFFLEtBQVU7UUFDMUIsSUFBSSxPQUFlLENBQUM7UUFDcEIsT0FBTyxHQUFHLE9BQU8sS0FBSyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEIsT0FBTyxHQUFHLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDNUU7YUFBTSxJQUFJLE9BQU8sS0FBSyxJQUFJLFFBQVEsRUFBRTtZQUNuQyxPQUFPLEdBQUcsT0FBTyxLQUFLLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0RjthQUFNLElBQUksT0FBTyxLQUFLLElBQUksUUFBUSxFQUFFO1lBQ25DLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNoQixPQUFPLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3hFO2lCQUFNLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6QixPQUFPLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3ZFO1NBQ0Y7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBQ08sNEJBQUksR0FBWixVQUFhLEdBQVcsRUFBRSxPQUFZO1FBQ3BDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0Q7Ozs7OztPQU1HO0lBQ0gsNEJBQUksR0FBSixVQUFxQixHQUFXLEVBQUUsUUFBVyxFQUFFLEVBQU07UUFDbkQsSUFBSSxPQUFPLEVBQUUsSUFBSSxRQUFRLEVBQUU7WUFDekIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3RCOzttQkFFRztnQkFDSCxJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQUMsU0FBaUI7b0JBQy9DLDZCQUE2QjtvQkFDN0IsSUFBSSxZQUFZLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQzt3QkFBRSxPQUFPLElBQUksQ0FBQztvQkFDN0MsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDL0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUN0QixLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDbEQsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUM1QixnREFBZ0Q7d0JBQ2hELFVBQVUsR0FBRyxVQUFVLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDM0Q7b0JBQ0QsSUFBSSxVQUFVO3dCQUFFLE9BQU8sSUFBSSxDQUFDO2dCQUM5QixDQUFDLENBQUMsQ0FBQztnQkFDSCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDakIsZ0JBQWdCO29CQUNoQixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDO29CQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDcEIsT0FBTyxJQUFJLENBQUM7aUJBQ2I7cUJBQU07b0JBQ0wsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDOUQsT0FBTyxLQUFLLENBQUM7aUJBQ2Q7YUFDRjtTQUNGO2FBQU0sSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNILDJCQUFHLEdBQUgsVUFDRSxHQUFXLEVBQ1gsUUFBWTtRQUVaLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNSLElBQUksUUFBUTtnQkFBRSxPQUFPLFFBQVEsQ0FBQztZQUM5QixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFFLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVsRSxRQUFRLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsQixLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssT0FBTztnQkFDVixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0IsS0FBSyxPQUFPO2dCQUNWLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLEtBQUssUUFBUTtnQkFDWCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QjtnQkFDRSxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFTyxvQ0FBWSxHQUFwQixVQUFxQixHQUFXO1FBQzlCLE9BQU8sY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUEzSEQsSUEySEM7QUFFRCxTQUFTLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN4QixZQUFZLENBQUM7SUFFYixJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLFNBQVMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7UUFDbEUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hCO0lBQ0QsdURBQXVEO0lBQ3ZELElBQUksQ0FBQyxDQUFDLFdBQVcsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFO1FBQ25DLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxxRkFBcUY7SUFDckYsSUFBSSxDQUFDLFlBQVksUUFBUSxFQUFFO1FBQ3pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoQjtJQUNELGlIQUFpSDtJQUNqSCxJQUFJLENBQUMsWUFBWSxNQUFNLEVBQUU7UUFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hCO0lBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDMUMsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUU7UUFDN0MsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELGlEQUFpRDtJQUNqRCxJQUFJLENBQUMsWUFBWSxJQUFJLEVBQUU7UUFDckIsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELG1FQUFtRTtJQUNuRSxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksTUFBTSxDQUFDLEVBQUU7UUFDMUIsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUNELElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxNQUFNLENBQUMsRUFBRTtRQUMxQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsa0NBQWtDO0lBQ2xDLElBQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekIsT0FBTyxDQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM5QixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQyxDQUFDO1FBQ0YsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7WUFDakIsT0FBTyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxDQUNILENBQUM7QUFDSixDQUFDO0FBRUQsaUJBQVMsYUFBYSxDQUFDIn0=