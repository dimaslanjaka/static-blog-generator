"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findYarnRootWorkspace = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var micromatch_1 = tslib_1.__importDefault(require("micromatch"));
var path_1 = require("path");
/**
 * search yarn root workspace folder
 * @param ctx option with property `base_dir`
 */
function findYarnRootWorkspace(ctx) {
    var baseDir = ctx.base_dir;
    /**
     * extract workspaces from package.json
     * @param manifest
     * @returns
     */
    var extractWorkspaces = function (manifest) {
        var workspaces = (manifest || {}).workspaces;
        return (workspaces && workspaces.packages) || (Array.isArray(workspaces) ? workspaces : null);
    };
    /**
     * read package.json from given folder
     * @param dir
     * @returns
     */
    var readPackageJSON = function (dir) {
        var file = (0, path_1.join)(dir, 'package.json');
        if ((0, fs_1.existsSync)(file)) {
            return JSON.parse((0, fs_1.readFileSync)(file).toString());
        }
        return null;
    };
    var previous = null;
    var current = (0, path_1.normalize)(baseDir);
    // loop searching
    do {
        var manifest = readPackageJSON(current);
        var workspaces = extractWorkspaces(manifest);
        if (workspaces) {
            var relativePath = (0, path_1.relative)(current, baseDir);
            if (relativePath === '' || (0, micromatch_1.default)([relativePath], workspaces).length > 0) {
                return current;
            }
            return null;
        }
        previous = current;
        current = (0, path_1.dirname)(current);
    } while (current !== previous);
    return null;
}
exports.findYarnRootWorkspace = findYarnRootWorkspace;
exports.default = findYarnRootWorkspace;
//# sourceMappingURL=findYarnRootWorkspace.js.map