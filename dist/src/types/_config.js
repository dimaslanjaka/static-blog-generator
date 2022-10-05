"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.project_config = exports.getConfig = exports.theme_config = exports.tmp = exports.post_source_dir = exports.post_generated_dir = exports.post_public_dir = exports.isDev = exports.verbose = exports.useCache = exports.deployDir = exports.configDeploy = exports.default_project_config = exports.cwd = exports.theme_yml = exports.theme_dir = exports.root = exports.argv = void 0;
var deepmerge_ts_1 = require("deepmerge-ts");
var fs_1 = require("fs");
var memoizee_1 = __importDefault(require("memoizee"));
var upath_1 = require("upath");
var util_1 = require("util");
var yaml_1 = __importDefault(require("yaml"));
var yargs_1 = __importDefault(require("yargs"));
require("../a-core");
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
        if ('article_ads' in adsense) {
            if (Array.isArray(adsense.article_ads)) {
                if (adsense.article_ads.length) {
                    project_config_merge.adsense.article_ads =
                        adsense.article_ads.map(findads);
                }
            }
        }
        if ('multiplex_ads' in adsense) {
            if (Array.isArray(adsense.multiplex_ads)) {
                if (adsense.multiplex_ads.length) {
                    adsense.multiplex_ads =
                        project_config_merge.adsense.multiplex_ads.map(findads);
                }
            }
        }
    }
}
var config = project_config_merge;
// @todo assign config cached to object config
var cached_config = (0, upath_1.join)((0, exports.cwd)(), '_config.cached.yml');
if ((0, fs_1.existsSync)(cached_config)) {
    config = (0, deepmerge_ts_1.deepmerge)(config, (0, yaml_2.yamlParse)(cached_config));
    if (config.env === 'development')
        (0, filemanager_1.write)((0, upath_1.join)(__dirname, 'tmp/_config.log'), (0, util_1.inspect)(config));
}
/**
 * Config Deployment
 */
exports.configDeploy = config.deploy;
/**
 * Deployment Directory
 */
exports.deployDir = (0, upath_1.resolve)((0, upath_1.join)(process.cwd(), '.deploy_' + config.deploy.type));
// @todo [config] bypass nocache if --nocache argument is set by cli
if (exports.argv['nocache']) {
    if ('generator' in config === false)
        config['generator'] = {
            cache: false,
            type: null,
            copy: {
                posts: {
                    space: true
                }
            }
        };
    if ('cache' in config.generator)
        config['generator']['cache'] = false;
}
// @todo [config] bypass verbose if --verbose argument is set by cli
if (exports.argv['verbose'])
    config.verbose = true;
// @todo [config] bypass environment favor if --dev or --development argument is set by cli
if (exports.argv['dev'] || exports.argv['development'])
    config.env = 'development';
/**
 * is process using cache strategy?
 */
exports.useCache = config.generator.cache;
/**
 * is verbose activated?
 */
exports.verbose = config.verbose;
exports.isDev = config.env === 'development';
config.url = config.url.replace(/\/+$/, '');
/**
 * Public Source Post Dir ({@link config.source_dir})
 */
exports.post_public_dir = (0, filemanager_1.crossNormalize)((0, upath_1.resolve)((0, upath_1.join)(root, config.source_dir, '_posts')));
/**
 * Generated directory ({@link config.public_dir})
 */
exports.post_generated_dir = (0, filemanager_1.crossNormalize)((0, upath_1.resolve)((0, upath_1.join)(root, config.public_dir)));
/**
 * `src-posts/` directory
 */
exports.post_source_dir = (0, filemanager_1.crossNormalize)((0, upath_1.resolve)((0, upath_1.join)(root, 'src-posts')));
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
    return (0, upath_1.join)(root, 'tmp', path.filter(function (s) { return s; }).join('/'));
};
exports.tmp = tmp;
if (!(0, fs_1.existsSync)((0, exports.tmp)()))
    try {
        (0, fs_1.mkdirSync)((0, exports.tmp)());
    }
    catch (_a) {
        //
    }
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
// merge with default config
config = (0, deepmerge_ts_1.deepmerge)(_config_default_1.default, config);
exports.default = config;
exports.project_config = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy90eXBlcy9fY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDZDQUF5QztBQUV6Qyx5QkFBeUQ7QUFDekQsc0RBQWdDO0FBRWhDLCtCQUE4QztBQUM5Qyw2QkFBK0I7QUFDL0IsOENBQXdCO0FBQ3hCLGdEQUEwQjtBQUMxQixxQkFBbUI7QUFDbkIsbURBQWtFO0FBQ2xFLHFDQUEyQztBQUMzQyx5REFBc0Q7QUFDdEQsdUNBQTJDO0FBQzNDLHNFQUErQztBQUUvQyw0RUFBcUQ7QUFFckQ7O0dBRUc7QUFDVSxRQUFBLElBQUksR0FBRyxJQUFBLGVBQUssRUFBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUt0RDs7R0FFRztBQUNILElBQU0sSUFBSSxHQUFHLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBTDFCLG9CQUFJO0FBTUEsUUFBQSxHQUFHLEdBQUcsSUFBQSxrQkFBUSxFQUFDLGNBQU0sT0FBQSxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO0FBQ3pELElBQU0sSUFBSSxHQUFHLElBQUEsWUFBSSxFQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUV2QyxJQUFNLFVBQVUsR0FBRyxJQUFBLGVBQVUsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBQSxpQkFBWSxFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3ZFLDZCQUE2QjtBQUNoQixRQUFBLHNCQUFzQixHQUFHLHlCQUFjLENBQUM7QUFXckQsSUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUN4Qyw4QkFBc0IsRUFDdEIsSUFBQSxnQkFB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