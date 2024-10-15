'use strict';

var EventEmitter = require('events');
var fs = require('fs-extra');
var url = require('node:url');
var path = require('upath');
require('path');
require('bluebird');
require('minimatch');
require('../utils/filemanager/case-path.js');
var writefile = require('../utils/filemanager/writefile.js');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
const __filename$1 = url.fileURLToPath((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('config/config-wrapper.js', document.baseURI).href)));
const __dirname$1 = path.dirname(__filename$1);
const configWrapperFile = path.join(__dirname$1, '_config_wrapper.json');
if (!fs.existsSync(configWrapperFile))
    fs.writeFileSync(configWrapperFile, '{}');
const configWrapper = fs.existsSync(fs.readFileSync(configWrapperFile, 'utf-8'))
    ? JSON.parse(configWrapperFile)
    : {};
/**
 * Create/Update config wrapper
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class createConfig extends EventEmitter {
    cname;
    /**
     * Create/Update config wrapper
     * @param name config name
     * @param value initial config value
     */
    constructor(name, value) {
        super();
        // assign config name
        this.cname = name;
        // add config
        if (!configWrapper[name]) {
            configWrapper[name] = value;
            this.emit('add', value);
        }
        else {
            // update config
            this.update(value);
        }
    }
    /**
     * get config
     * @returns
     */
    get() {
        if (!configWrapper[this.cname])
            configWrapper[this.cname] = {};
        return configWrapper[this.cname];
    }
    /**
     * update config
     * @param value new values should be merged with old values using shallow object merge
     */
    update(value) {
        configWrapper[this.cname] = Object.assign({}, this.get(), value);
        fs.accessSync(configWrapperFile, fs.constants.W_OK);
        writefile.writefile(configWrapperFile, JSON.stringify(configWrapper, null, 2));
        this.emit('update');
    }
}

exports.createConfig = createConfig;
