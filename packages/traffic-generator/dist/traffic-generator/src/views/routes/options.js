"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../../db"));
const constant_1 = require("../../db/constant");
const proxyFile_1 = __importDefault(require("../../proxies/proxyFile"));
// database folder
const dbf = path_1.default.join(process.cwd(), "databases");
// database class
const db = new db_1.default(dbf);
let proxies = db.get(constant_1.DB_PROXIES_KEY, []);
const textarea = document.querySelector("#proxies");
textarea.value = proxies.join("\n");
textarea.dispatchEvent(new Event("change"));
const formOpt = document.querySelector("#form-options");
formOpt.onsubmit = function (e) {
    e.preventDefault();
    const formData = new FormData(document.querySelector("#form-options"));
    const proxiesValue = formData.get("proxies");
    const parse = proxyFile_1.default.parseProxyFromText(proxiesValue.toString());
    if (parse.length) {
        db.push(constant_1.DB_PROXIES_KEY, parse);
        proxies = db.get(constant_1.DB_PROXIES_KEY, []);
        textarea.value = proxies.join("\n");
        textarea.dispatchEvent(new Event("change"));
    }
};
//# sourceMappingURL=options.js.map