/// <reference path="Object.d.ts" />
Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};
Object.child = function (str, callback) {
    var self = this;
    if (self.hasOwnProperty(str)) {
        if (typeof callback == "function") {
            return callback(self[str]);
        }
        else {
            return true;
        }
    }
    else {
        return undefined;
    }
};
Object.alt = function (str, alternative) {
    var self = this;
    if (self.hasOwnProperty(str)) {
        return self[str];
    }
    else {
        return alternative;
    }
};
Object.has = function (str) {
    return this.hasOwnProperty(str);
};
Object.each = function (callback) {
    for (var key in this) {
        //callback.call(scope, key, this[key]);
        callback.call(this[key]);
    }
};
Object.isEmpty = function () {
    return this.length === 0;
};
/**
 * Join object to separated string
 * @param obj Object
 * @returns Joined string
 */
function object_join(obj) {
    return Object.keys(obj)
        .map(function (k) {
        return obj[k];
    })
        .join(",");
}
/**
 * Extend Object
 * @param arg1
 * @param arg2
 * @returns
 */
function extend_object(arg1, arg2) {
    var result = {};
    for (var prop in arg1) {
        if (arg1.hasOwnProperty(prop)) {
            // error when using --strictNullChecks
            result[prop] = arg1[prop];
        }
    }
    for (var prop in arg2) {
        if (arg2.hasOwnProperty(prop)) {
            // error when using --strictNullChecks
            result[prop] = arg2[prop];
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vaGV4by1zZW8vcGFja2FnZXMvanMtcHJvdG90eXBlcy9zcmMvT2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUVwQyxNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVUsR0FBRztJQUMxQixJQUFJLElBQUksR0FBRyxDQUFDLEVBQ1gsR0FBUSxDQUFDO0lBQ1YsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFO1FBQ2hCLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUM7WUFBRSxJQUFJLEVBQUUsQ0FBQztLQUNwQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsRUFBRSxRQUFRO0lBQ3JDLElBQU0sSUFBSSxHQUFRLElBQUksQ0FBQztJQUN2QixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDN0IsSUFBSSxPQUFPLFFBQVEsSUFBSSxVQUFVLEVBQUU7WUFDbEMsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDM0I7YUFBTTtZQUNOLE9BQU8sSUFBSSxDQUFDO1NBQ1o7S0FDRDtTQUFNO1FBQ04sT0FBTyxTQUFTLENBQUM7S0FDakI7QUFDRixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBRyxFQUFFLFdBQVc7SUFDdEMsSUFBTSxJQUFJLEdBQVEsSUFBSSxDQUFDO0lBQ3ZCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM3QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNqQjtTQUFNO1FBQ04sT0FBTyxXQUFXLENBQUM7S0FDbkI7QUFDRixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBb0I7SUFDMUMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pDLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVSxRQUFRO0lBQy9CLEtBQUssSUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ3ZCLHVDQUF1QztRQUN2QyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3pCO0FBQ0YsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNoQixPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0FBQzFCLENBQUMsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxTQUFTLFdBQVcsQ0FBQyxHQUFXO0lBQy9CLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDckIsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUNmLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBUyxhQUFhLENBQ3JCLElBQVEsRUFDUixJQUFRO0lBRVIsSUFBTSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztJQUNwQyxLQUFLLElBQU0sSUFBSSxJQUFJLElBQUksRUFBRTtRQUN4QixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUIsc0NBQXNDO1lBQ3JDLE1BQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEM7S0FDRDtJQUNELEtBQUssSUFBTSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ3hCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QixzQ0FBc0M7WUFDckMsTUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQztLQUNEO0lBQ0QsT0FBTyxNQUFpQixDQUFDO0FBQzFCLENBQUMifQ==