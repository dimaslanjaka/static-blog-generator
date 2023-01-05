"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
// [task] generate empty config if not exists
[
    (0, path_1.join)(__dirname, 'types/_config_project.json'),
    (0, path_1.join)(__dirname, 'types/_config_theme.json'),
    (0, path_1.join)(__dirname, 'types/_config_hashes.json')
].forEach((path) => {
    if (!(0, fs_1.existsSync)(path)) {
        if (!(0, fs_1.existsSync)((0, path_1.dirname)(path)))
            (0, fs_1.mkdirSync)((0, path_1.dirname)(path), { recursive: true });
        (0, fs_1.writeFileSync)(path, '{}');
    }
});
//# sourceMappingURL=a_index.js.map