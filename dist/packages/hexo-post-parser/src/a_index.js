"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
// [task] generate empty config if not exists
[
    (0, path_1.join)(__dirname, 'types/_config_project.json'),
    (0, path_1.join)(__dirname, 'types/_config_theme.json'),
    (0, path_1.join)(__dirname, 'types/_config_hashes.json')
].forEach(function (path) {
    if (!(0, fs_1.existsSync)(path)) {
        (0, fs_1.writeFileSync)(path, '{}');
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYV9pbmRleC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2hleG8tcG9zdC1wYXJzZXIvc3JjL2FfaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBK0M7QUFDL0MsNkJBQTRCO0FBRTVCLDZDQUE2QztBQUM3QztJQUNFLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQztJQUM3QyxJQUFBLFdBQUksRUFBQyxTQUFTLEVBQUUsMEJBQTBCLENBQUM7SUFDM0MsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLDJCQUEyQixDQUFDO0NBQzdDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtJQUNiLElBQUksQ0FBQyxJQUFBLGVBQVUsRUFBQyxJQUFJLENBQUMsRUFBRTtRQUNyQixJQUFBLGtCQUFhLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzNCO0FBQ0gsQ0FBQyxDQUFDLENBQUMifQ==