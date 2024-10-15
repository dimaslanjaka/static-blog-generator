import fs__default from 'fs-extra';
import url from 'node:url';
import path__default from 'upath';
import yaml__default from 'yaml';
import 'ansi-colors';
import 'stream';
import '../utils/logger.mjs';
import 'debug';
import '../utils/filemanager/case-path.mjs';
import 'path';
import 'bluebird';
import 'minimatch';
import { writefile } from '../utils/filemanager/writefile.mjs';
import 'axios';
import 'crypto';
import 'glob';
import '../utils/JSON-serializer.mjs';
import '../utils/JSON.mjs';
import '../utils/lockmanager.mjs';
import 'fs';
import 'micromatch';
import 'hexo-util';
import 'nunjucks';
import { orderKeys } from '../utils/object.mjs';
import '../utils/promisify.mjs';
import '../utils/scheduler.mjs';
import { getDefaultConfig } from './default-config.mjs';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path__default.dirname(__filename);
const configFileJSON = path__default.join(__dirname, '_config.json');
if (!fs__default.existsSync(configFileJSON))
    fs__default.writeFileSync(configFileJSON, '{}');
let settledConfig = getDefaultConfig();
/**
 * find `_config.yml`
 * @param fileYML path to file `_config.yml` or working directory
 */
function fetchConfig(fileYML) {
    if (!fileYML) {
        fileYML = path__default.join(process.cwd(), '_config.yml');
    }
    else if (!fileYML.endsWith('_config.yml')) {
        fileYML += '/_config.yml';
    }
    const configYML = yaml__default.parse(fs__default.readFileSync(path__default.resolve(fileYML), 'utf-8'));
    setConfig(orderKeys(configYML));
    writefile(configFileJSON, JSON.stringify(configYML, null, 2));
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
        deployDir = path__default.join(settledConfig.cwd, '.deploy_' + settledConfig.deploy?.type || 'git');
    }
    // subfolder - assign deploy.folder
    if (settledConfig.deploy.folder) {
        deployDir = path__default.join(deployDir, settledConfig.folder);
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

export { commonIgnore, deployConfig, fetchConfig, getConfig, projectIgnores, setConfig };
