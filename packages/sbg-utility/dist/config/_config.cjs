'use strict';

var fs = require('fs-extra');
var url = require('node:url');
var path = require('upath');
var yaml = require('yaml');
require('ansi-colors');
require('stream');
require('../utils/logger.cjs');
require('debug');
require('../utils/filemanager/case-path.cjs');
require('path');
require('bluebird');
require('minimatch');
var writefile = require('../utils/filemanager/writefile.cjs');
require('fs');
require('micromatch');
require('axios');
require('crypto');
require('glob');
require('../utils/JSON-serializer.cjs');
require('../utils/JSON.cjs');
require('../utils/lockmanager.cjs');
require('hexo-util');
require('nunjucks');
var object = require('../utils/object.cjs');
require('../utils/promisify.cjs');
require('../utils/scheduler.cjs');
var defaultConfig = require('./default-config.cjs');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
const __filename$1 = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('config/_config.cjs', document.baseURI).href)));
const __dirname$1 = path.dirname(__filename$1);
const configFileJSON = path.join(__dirname$1, '_config.json');
if (!fs.existsSync(configFileJSON))
    fs.writeFileSync(configFileJSON, '{}');
let settledConfig = defaultConfig.getDefaultConfig();
/**
 * find `_config.yml`
 * @param fileYML path to file `_config.yml` or working directory
 */
function fetchConfig(fileYML) {
    if (!fileYML) {
        fileYML = path.join(process.cwd(), '_config.yml');
    }
    else if (!fileYML.endsWith('_config.yml')) {
        fileYML += '/_config.yml';
    }
    const configYML = yaml.parse(fs.readFileSync(path.resolve(fileYML), 'utf-8'));
    setConfig(object.orderKeys(configYML));
    writefile.writefile(configFileJSON, JSON.stringify(configYML, null, 2));
}
// fetch _config.yml first init
// fetchConfig(join(process.cwd(), '_config.yml'));
/**
 * Config setter
 * * useful for jest
 * @param obj
 */
function setConfig(obj) {
    settledConfig = Object.assign(settledConfig || {}, obj);
    return getConfig();
}
/**
 * Config getter
 * * useful for jest
 * @returns
 */
function getConfig() {
    settledConfig.deploy = Object.assign(settledConfig.deploy || {}, deployConfig());
    return settledConfig;
}
/**
 * get deployment config
 * @returns
 */
function deployConfig() {
    let deployDir;
    if (settledConfig.deploy_dir) {
        // deploy_dir was set
        deployDir = settledConfig.deploy_dir;
    }
    else {
        // fallback get from deploy.type
        deployDir = path.join(settledConfig.cwd, '.deploy_' + settledConfig.deploy?.type || 'git');
    }
    // subfolder - assign deploy.folder
    if (settledConfig.deploy.folder) {
        deployDir = path.join(deployDir, settledConfig.folder);
    }
    return { deployDir };
}
/**
 * common ignore files
 * @example
 * const config = getConfig();
 * const excludes = Array.isArray(config.exclude) ? config.exclude : [];
 * excludes.push(...commonIgnore);
 */
const commonIgnore = [
    '**/yandex_*.html', // skip yandex verification file
    // '**/comments.html',
    // '**/disqus-comments.html',
    // '**/comment.html', // skip comment.html
    '**/favicon.html', // skip favicon
    '**/404.html', // skip 404
    '**/node_modules/**', // skip node_modules
    '**/tmp/**', // skip tmp
    '**/build/**', // skip build
    '**/.cache/**', // skip common cache folder
    '**/.vscode/**', // skip vscode configuration folder
    '**/.frontmatter/**', // skip frontmatter vscode extension
    '**/pinterest-*.html', // skip pinterest verification file
    '**/_*.standalone.{js,ts}', // skip _filename.standalone.js
    '**/desktop.ini', // windows desktop.ini
    '**/node_modules/**', // node_modules
    '**/.frontmatter/**', // vscode frontmatter plugin
    '**/.git*/**', // any git configs
    '**/.*' // skip dots
];
/**
 * array of config.exclude, config.ignore
 */
const projectIgnores = [...(getConfig().skip_render || []), ...(getConfig().ignore || [])];

exports.commonIgnore = commonIgnore;
exports.deployConfig = deployConfig;
exports.fetchConfig = fetchConfig;
exports.getConfig = getConfig;
exports.projectIgnores = projectIgnores;
exports.setConfig = setConfig;
