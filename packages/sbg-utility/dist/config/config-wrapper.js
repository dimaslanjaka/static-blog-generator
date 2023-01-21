"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = void 0;
var events_1 = __importDefault(require("events"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var upath_1 = __importDefault(require("upath"));
var filemanager_1 = require("../utils/filemanager");
var configWrapperFile = upath_1.default.join(__dirname, '_config_wrapper.json');
var configWrapper = fs_extra_1.default.existsSync(fs_extra_1.default.readFileSync(configWrapperFile, 'utf-8'))
    ? JSON.parse(configWrapperFile)
    : {};
/**
 * Create/Update config wrapper
 * @param name
 * @param value
 * @returns
 */
var createConfig = /** @class */ (function (_super) {
    __extends(createConfig, _super);
    function createConfig(name, value) {
        var _this = _super.call(this) || this;
        // assign config name
        _this.cname = name;
        // add config
        if (!configWrapper[name]) {
            configWrapper[name] = value;
            _this.emit('add', value);
        }
        else {
            // update config
            _this.update(value);
        }
        return _this;
    }
    createConfig.prototype.get = function () {
        return configWrapper[this.cname];
    };
    createConfig.prototype.update = function (value) {
        if (!configWrapper[this.cname])
            configWrapper[this.cname] = {};
        configWrapper[this.cname] = Object.assign(configWrapper[this.cname], value);
        if ((fs_extra_1.default.access(configWrapperFile), fs_extra_1.default.constants.W_OK)) {
            (0, filemanager_1.writefile)(configWrapperFile, JSON.stringify(configWrapper, null, 2));
            this.emit('update');
        }
    };
    return createConfig;
}(events_1.default));
exports.createConfig = createConfig;
//# sourceMappingURL=config-wrapper.js.map