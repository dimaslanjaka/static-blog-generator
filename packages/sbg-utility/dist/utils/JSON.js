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
//# sourceMappingURL=JSON.js.map