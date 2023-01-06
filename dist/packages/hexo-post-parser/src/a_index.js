"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
[
    (0, path_1.join)(__dirname, 'types/_config_project.json'),
    (0, path_1.join)(__dirname, 'types/_config_theme.json'),
    (0, path_1.join)(__dirname, 'types/_config_hashes.json')
].forEach(function (path) {
    if (!(0, fs_1.existsSync)(path)) {
        if (!(0, fs_1.existsSync)((0, path_1.dirname)(path)))
            (0, fs_1.mkdirSync)((0, path_1.dirname)(path), { recursive: true });
        (0, fs_1.writeFileSync)(path, '{}');
    }
});
