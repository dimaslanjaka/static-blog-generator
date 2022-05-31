"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gulp_1 = __importDefault(require("gulp"));
var _config_1 = __importDefault(require("../../types/_config"));
require("./deploy/firebase");
var git_1 = require("./deploy/git");
gulp_1.default.task('deploy-git', git_1.deployerGit);
if ('deploy' in _config_1.default &&
    typeof _config_1.default.deploy == 'object' &&
    'type' in _config_1.default.deploy) {
    gulp_1.default.task('deploy', gulp_1.default.series('deploy-' + _config_1.default['deploy']['type']));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2d1bHAvdGFza3MvZGVwbG95LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXdCO0FBQ3hCLGdFQUF5QztBQUN6Qyw2QkFBMkI7QUFDM0Isb0NBQTJDO0FBRTNDLGNBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLGlCQUFXLENBQUMsQ0FBQztBQUNyQyxJQUNFLFFBQVEsSUFBSSxpQkFBTTtJQUNsQixPQUFPLGlCQUFNLENBQUMsTUFBTSxJQUFJLFFBQVE7SUFDaEMsTUFBTSxJQUFJLGlCQUFNLENBQUMsTUFBTSxFQUN2QjtJQUNBLGNBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLGlCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3hFIn0=