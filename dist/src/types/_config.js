"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.project_config = exports.getConfig = exports.theme_config = exports.theme_yml = exports.theme_dir = exports.tmp = exports.post_source_dir = exports.post_generated_dir = exports.post_public_dir = exports.isDev = exports.verbose = exports.default_project_config = exports.root = exports.cwd = exports.argv = void 0;
require("../a-core");
var fs_1 = require("fs");
var memoizee_1 = __importDefault(require("memoizee"));
var upath_1 = require("upath");
var yaml_1 = __importDefault(require("yaml"));
var yargs_1 = __importDefault(require("yargs"));
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
exports.theme_dir = (0, upath_1.toUnix)((0, upath_1.resolve)((0, upath_1.join)(root, 'themes', config.theme)));
/** _config.yml object from theme directory */
exports.theme_yml = (0, upath_1.join)(exports.theme_dir, '_config.yml');
/** merged theme config object */
exports.theme_config = Object.assign(_config_theme_json_1.default, (0, fs_1.existsSync)(exports.theme_yml) ? yaml_1.default.parse((0, fs_1.readFileSync)(exports.theme_yml, 'utf-8')) : {});
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
/** EXPORT PRIVATE AND PUBLIC CONFIGS */
exports.default = config;
exports.project_config = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy90eXBlcy9fY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFCQUFtQjtBQUVuQix5QkFBeUQ7QUFDekQsc0RBQWdDO0FBRWhDLCtCQUE4QztBQUM5Qyw4Q0FBd0I7QUFDeEIsZ0RBQTBCO0FBQzFCLHVDQUF1QztBQUN2QyxtREFBa0Q7QUFDbEQscUNBQTJDO0FBQzNDLHlEQUFzRDtBQUN0RCx1Q0FBMkM7QUFDM0Msc0VBQStDO0FBRS9DLDRFQUFxRDtBQUVyRDs7R0FFRztBQUNVLFFBQUEsSUFBSSxHQUFHLElBQUEsZUFBSyxFQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBRXREOztHQUVHO0FBQ0gsSUFBTSxJQUFJLEdBQUcsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFHMUIsb0JBQUk7QUFGQSxRQUFBLEdBQUcsR0FBRyxJQUFBLGtCQUFRLEVBQUMsY0FBTSxPQUFBLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUM7QUFDekQsSUFBTSxJQUFJLEdBQUcsSUFBQSxZQUFJLEVBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRXZDLElBQU0sVUFBVSxHQUFHLElBQUEsZUFBVSxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFBLGlCQUFZLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDdkUsNkJBQTZCO0FBQ2hCLFFBQUEsc0JBQXNCLEdBQUcseUJBQWMsQ0FBQztBQVdyRCxJQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQ3hDLDhCQUFzQixFQUN0QixJQUFBLGdCQUFTLEVBQUMsVUFBVSxD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