"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = require("path");
const sitemap_1 = tslib_1.__importDefault(require("../src/sitemap"));
const links = ['https://www.webmanajemen.com'];
const opts = {
    isProgress: true,
    isLog: true
};
(0, sitemap_1.default)(links, opts, (err, res) => {
    if (!err) {
        if (!fs_1.default.existsSync((0, path_1.join)(__dirname, '../tmp')))
            fs_1.default.mkdirSync((0, path_1.join)(__dirname, '../tmp'));
        fs_1.default.writeFileSync((0, path_1.join)(__dirname, '../tmp/test.json'), JSON.stringify(res, null, 2));
        console.log('finish', (0, path_1.join)(__dirname, '../tmp/test.json'));
    }
});
