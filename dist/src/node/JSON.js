"use strict";
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./JSON.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.json_encode = void 0;
JSON.stringifyWithCircularRefs = (function () {
    var refs = new Map();
    var parents = [];
    var path = ['this'];
    function clear() {
        refs.clear();
        parents.length = 0;
        path.length = 1;
    }
    function updateParents(key, value) {
        var idx = parents.length - 1;
        var prev = parents[idx];
        if (prev[key] === value || idx === 0) {
            path.push(key);
            parents.push(value);
        }
        else {
            while (idx-- >= 0) {
                prev = parents[idx];
                if (prev[key] === value) {
                    idx += 2;
                    parents.length = idx;
                    path.length = idx;
                    --idx;
                    parents[idx] = value;
                    path[idx] = key;
                    break;
                }
            }
        }
    }
    function checkCircular(key, value) {
        if (value != null) {
            if (typeof value === 'object') {
                if (key) {
                    updateParents(key, value);
                }
                var other = refs.get(value);
                if (other) {
                    return '[Circular Reference]' + other;
                }
                else {
                    refs.set(value, path.join('.'));
                }
            }
        }
        return value;
    }
    return function stringifyWithCircularRefs(obj, space) {
        if (space === void 0) { space = 2; }
        try {
            parents.push(obj);
            return JSON.stringify(obj, checkCircular, space);
        }
        finally {
            clear();
        }
    };
})();
/**
 * json_encode PHP equivalent
 * * support circular refs
 * @param data
 * @returns
 */
function json_encode(data, indent) {
    return JSON.stringifyWithCircularRefs(data, indent);
}
exports.json_encode = json_encode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSlNPTi5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9ub2RlL0pTT04udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhEQUE4RDtBQUM5RCxvQ0FBb0M7OztBQUVwQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsQ0FBQztJQUNoQyxJQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNuQixJQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXRCLFNBQVMsS0FBSztRQUNaLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxTQUFTLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSztRQUMvQixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDckI7YUFBTTtZQUNMLE9BQU8sR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNqQixJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLEVBQUU7b0JBQ3ZCLEdBQUcsSUFBSSxDQUFDLENBQUM7b0JBQ1QsT0FBTyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO29CQUNsQixFQUFFLEdBQUcsQ0FBQztvQkFDTixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO29CQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUNoQixNQUFNO2lCQUNQO2FBQ0Y7U0FDRjtJQUNILENBQUM7SUFFRCxTQUFTLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSztRQUMvQixJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDakIsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQzdCLElBQUksR0FBRyxFQUFFO29CQUNQLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQzNCO2dCQUVELElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlCLElBQUksS0FBSyxFQUFFO29CQUNULE9BQU8sc0JBQXNCLEdBQUcsS0FBSyxDQUFDO2lCQUN2QztxQkFBTTtvQkFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ2pDO2FBQ0Y7U0FDRjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELE9BQU8sU0FBUyx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsS0FBUztRQUFULHNCQUFBLEVBQUEsU0FBUztRQUN0RCxJQUFJO1lBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsRDtnQkFBUztZQUNSLEtBQUssRUFBRSxDQUFDO1NBQ1Q7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsRUFBRSxDQUFDO0FBRUw7Ozs7O0dBS0c7QUFDSCxTQUFnQixXQUFXLENBQ3pCLElBQU8sRUFDUCxNQUFlO0lBRWYsT0FBTyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELENBQUM7QUFMRCxrQ0FLQyJ9