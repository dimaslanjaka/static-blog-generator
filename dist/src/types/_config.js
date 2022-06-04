"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.project_config = exports.theme_yml = exports.theme_dir = exports.root = exports.getConfig = exports.theme_config = exports.tmp = exports.post_source_dir = exports.post_generated_dir = exports.post_public_dir = exports.isDev = exports.verbose = exports.default_project_config = exports.cwd = exports.argv = void 0;
var fs_1 = require("fs");
var memoizee_1 = __importDefault(require("memoizee"));
var upath_1 = require("upath");
var yaml_1 = __importDefault(require("yaml"));
var yargs_1 = __importDefault(require("yargs"));
require("../a-core");
var cache_1 = require("../node/cache");
var filemanager_1 = require("../node/filemanager");
var JSON_1 = require("../node/JSON");
var object_utility_1 = require("../node/object-utility");
var yaml_2 = require("../parser/yaml");
var _config_default_1 = __importDefault(require("./_config.default"));
var _config_theme_json_1 = __importDefault(require("./_config_theme.json"));
/**
 * Argument CLI reader
 */
exports.argv = (0, yargs_1.default)(process.argv.slice(2)).argv;
/**
 * process cwd unix style
 */
var root = (0, upath_1.toUnix)(process.cwd());
exports.root = root;
exports.cwd = (0, memoizee_1.default)(function () { return (0, upath_1.toUnix)(process.cwd()); });
var file = (0, upath_1.join)(root, '_config.yml');
var readConfig = (0, fs_1.existsSync)(file) ? (0, fs_1.readFileSync)(file, 'utf-8') : '';
/** default project config */
exports.default_project_config = _config_default_1.default;
var project_config_merge = Object.assign(exports.default_project_config, (0, yaml_2.yamlParse)(readConfig));
// @todo [config] set env
project_config_merge['env'] = process.env['NODE_ENV'];
// @todo [config] resolve adsense
if ('adsense' in project_config_merge) {
    var adsense = project_config_merge.adsense;
    if ('enable' in adsense && adsense.enable) {
        var findads = function (path) {
            var findpath = (0, upath_1.join)((0, exports.cwd)(), path);
            if (!(0, fs_1.existsSync)(findpath)) {
                findpath = (0, upath_1.join)(root, path);
            }
            if ((0, fs_1.existsSync)(findpath))
                return String((0, filemanager_1.read)(findpath));
        };
        if ('article_ads' in adsense)
            if (adsense.article_ads.length) {
                project_config_merge.adsense.article_ads =
                    adsense.article_ads.map(findads);
            }
        if ('multiplex_ads' in adsense)
            if (adsense.multiplex_ads.length) {
                adsense.multiplex_ads =
                    project_config_merge.adsense.multiplex_ads.map(findads);
            }
    }
}
var config = project_config_merge;
// @todo [config] bypass nocache if --nocache argument is set by cli
if (exports.argv['nocache'])
    config.generator.cache = false;
// @todo [config] bypass verbose if --verbose argument is set by cli
if (exports.argv['verbose'])
    config.verbose = true;
// @todo [config] bypass environment favor if --dev or --development argument is set by cli
if (exports.argv['dev'] || exports.argv['development'])
    config.env = 'development';
/**
 * is verbose activated?
 */
exports.verbose = config.verbose;
exports.isDev = config.env === 'development';
config.url = config.url.replace(/\/+$/, '');
/**
 * Public Source Post Dir ({@link config.source_dir})
 */
exports.post_public_dir = (0, upath_1.resolve)((0, upath_1.join)(root, config.source_dir, '_posts'));
/**
 * Generated directory ({@link config.public_dir})
 */
exports.post_generated_dir = (0, upath_1.resolve)((0, upath_1.join)(root, config.public_dir));
/**
 * `src-posts/` directory
 */
exports.post_source_dir = (0, upath_1.resolve)((0, upath_1.join)(root, 'src-posts'));
var pc = (0, cache_1.pcache)('tmp');
/**
 * path to temp folder
 * * cacheable
 * @param path file path inside temp folder
 * @returns
 */
var tmp = function () {
    var path = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        path[_i] = arguments[_i];
    }
    var key = String(path);
    var get = pc.getSync(key);
    if (get)
        return get;
    var result = (0, upath_1.join)(root, 'tmp', path.filter(function (s) { return s; }).join('/'));
    pc.putSync(key, result);
    return result;
};
exports.tmp = tmp;
if (!(0, fs_1.existsSync)((0, exports.tmp)()))
    (0, fs_1.mkdirSync)((0, exports.tmp)());
/** THEME CONFIGS */
/** theme directory */
var theme_dir = (0, upath_1.toUnix)((0, upath_1.resolve)((0, upath_1.join)(root, 'themes', config.theme)));
exports.theme_dir = theme_dir;
if (!(0, fs_1.existsSync)(theme_dir)) {
    exports.theme_dir = theme_dir = (0, upath_1.join)(process.cwd(), 'node_modules', 'sbg-theme-' + config.theme);
    if (!(0, fs_1.existsSync)(theme_dir)) {
        exports.theme_dir = theme_dir = (0, upath_1.join)(process.cwd(), 'node_modules', config.theme);
    }
}
/** _config.yml object from theme directory */
var theme_yml = (0, upath_1.join)(theme_dir, '_config.yml');
exports.theme_yml = theme_yml;
/** merged theme config object */
exports.theme_config = Object.assign(_config_theme_json_1.default, (0, fs_1.existsSync)(theme_yml) ? yaml_1.default.parse((0, fs_1.readFileSync)(theme_yml, 'utf-8')) : {});
/** WRITE AUTO GENERATED CONFIGS */
(0, filemanager_1.write)((0, upath_1.join)(__dirname, '_config_project.json'), (0, JSON_1.json_encode)(exports.isDev ? (0, object_utility_1.sortedObject)(config) : config));
(0, filemanager_1.write)((0, upath_1.join)(__dirname, '_config_theme.json'), (0, JSON_1.json_encode)(exports.isDev ? (0, object_utility_1.sortedObject)(exports.theme_config) : exports.theme_config));
/** SETUP PRIVATE CONFIGS */
var file_private_config = (0, upath_1.join)(root, '_config.private.yml');
if ((0, fs_1.existsSync)(file_private_config)) {
    var privateConfig = yaml_1.default.parse((0, fs_1.readFileSync)(file_private_config, 'utf-8'));
    if (Object.hasOwnProperty.call(privateConfig, 'firebase')) {
        config.firebase = privateConfig.firebase;
    }
}
/**
 * get config
 * @returns
 */
function getConfig() {
    return config;
}
exports.getConfig = getConfig;
config.root = root;
config.tmp = exports.tmp;
exports.default = config;
exports.project_config = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy90eXBlcy9fY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHlCQUF5RDtBQUN6RCxzREFBZ0M7QUFFaEMsK0JBQThDO0FBQzlDLDhDQUF3QjtBQUN4QixnREFBMEI7QUFDMUIscUJBQW1CO0FBQ25CLHVDQUF1QztBQUN2QyxtREFBa0Q7QUFDbEQscUNBQTJDO0FBQzNDLHlEQUFzRDtBQUN0RCx1Q0FBMkM7QUFDM0Msc0VBQStDO0FBRS9DLDRFQUFxRDtBQUVyRDs7R0FFRztBQUNVLFFBQUEsSUFBSSxHQUFHLElBQUEsZUFBSyxFQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBRXREOztHQUVHO0FBQ0gsSUFBTSxJQUFJLEdBQUcsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFpSzFCLG9CQUFJO0FBaEtBLFFBQUEsR0FBRyxHQUFHLElBQUEsa0JBQVEsRUFBQyxjQUFNLE9BQUEsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQztBQUN6RCxJQUFNLElBQUksR0FBRyxJQUFBLFlBQUksRUFBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFFdkMsSUFBTSxVQUFVLEdBQUcsSUFBQSxlQUFVLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUEsaUJBQVksRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUN2RSw2QkFBNkI7QUFDaEIsUUFBQSxzQkFBc0IsR0FBRyx5QkFBYyxDQUFDO0FBV3JELElBQU0sb0JBQW9CLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDeEMsOEJBQXNCLEVBQ3RCLElBQUEsZ0JBQVMsRUFBQyxVQUFV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