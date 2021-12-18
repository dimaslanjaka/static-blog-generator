"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
sqlite3_1.default.verbose();
(0, sqlite_1.open)({
    filename: path_1.default.join(process.cwd(), "/data/database.sqlite"),
    driver: sqlite3_1.default.cached.Database
}).then(async (db) => {
});
//# sourceMappingURL=sqlite3.js.map