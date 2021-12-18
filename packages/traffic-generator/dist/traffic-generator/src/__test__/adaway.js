"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const node_libcurl_1 = require("node-libcurl");
const path_1 = __importDefault(require("path"));
const ads = ["https://adaway.org/hosts.txt"];
async function get(url) {
    const { statusCode, data, headers } = await node_libcurl_1.curly.get(url);
    const _ref = data.replace(/#.*/g, "").split(/[\r\n]/);
    const _hosts = [];
    for (let _i = 0, _len = _ref.length; _i < _len; _i++) {
        const line = _ref[_i];
        const md = /(\d+\.\d+\.\d+\.\d+)\s+(.+)/.exec(line);
        if (md) {
            //obj[md[1]] = _.union(obj[md[1]] || [], md[2].trim().split(/\s+/));
            _hosts.push({
                host: md[1],
                domain: md[2]
            });
        }
    }
    return _hosts;
}
let hosts = [];
const adsx = ads.map((ad) => {
    return get(ad).then((arr) => {
        const arrays = arr.map((arr) => {
            return arr.domain;
        });
        hosts = hosts.concat(arrays);
        return hosts;
    });
});
const fileHosts = path_1.default.join(__dirname, "data/hosts.json");
adsx.map((adsx) => {
    if (!(0, fs_1.existsSync)(path_1.default.dirname(fileHosts))) {
        (0, fs_1.mkdirSync)(path_1.default.dirname(fileHosts));
    }
    (0, fs_1.writeFileSync)(fileHosts, JSON.stringify(hosts));
});
function default_1() {
    return JSON.parse((0, fs_1.readFileSync)(fileHosts).toString());
}
exports.default = default_1;
//# sourceMappingURL=adaway.js.map