"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const __1 = __importDefault(require(".."));
const db = new __1.default(path_1.default.join(__dirname, "databases"));
if (!db.exists("/test")) {
    db.push("/test/string", "string db");
    db.push("/test/number", parseInt(Math.random().toString()));
    db.push("/test/float", parseFloat(Math.random().toString()));
    db.push("/test/object", { key: "value" });
    db.push("/test/array", ["satu", "dua", "tiga"]);
}
console.log(db.get("/test/array"), db.get("/test/object"), db.get("/test/number"), db.get("/test/float"), db.get("/test/string"));
//# sourceMappingURL=index.js.map