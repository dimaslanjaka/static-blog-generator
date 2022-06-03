"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFuncName = exports.varToString = void 0;
/*
const _fn: FunctionType<string, number> = (n) => {
  return ['x'][n];
};
const _fns: FunctionType<string, number | string> = (n, s) => {
  return ['x', s][n];
};
const _fa: FunctionType<string, number | string> = (n, ...s) => {
  return String([String(n), String(s)]);
};
*/
/**
 * transform any variable type to string
 * @param varObj
 * @returns
 * @example
 * const func = () => {};
 * const funcName = varToString({ func });
 * console.log(funcName); // func
 */
var varToString = function (varObj) {
    return Object.keys(varObj)[0];
};
exports.varToString = varToString;
/**
 * get function name
 * @param func
 * @returns
 */
var getFuncName = function (func) {
    return func.name || (0, exports.varToString)({ func: func });
};
exports.getFuncName = getFuncName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9wYXJzZXIvdXRpbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFhQTs7Ozs7Ozs7OztFQVVFO0FBRUY7Ozs7Ozs7O0dBUUc7QUFDSSxJQUFNLFdBQVcsR0FBRyxVQUFDLE1BQXVDO0lBQ2pFLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFBdEIsQ0FBc0IsQ0FBQztBQURaLFFBQUEsV0FBVyxlQUNDO0FBRXpCOzs7O0dBSUc7QUFDSSxJQUFNLFdBQVcsR0FBRyxVQUFDLElBQTBCO0lBQ3BELE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSSxJQUFBLG1CQUFXLEVBQUMsRUFBRSxJQUFJLE1BQUEsRUFBRSxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDO0FBRlcsUUFBQSxXQUFXLGVBRXRCIn0=