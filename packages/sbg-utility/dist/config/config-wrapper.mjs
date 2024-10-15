import EventEmitter from 'events';
import fs__default from 'fs-extra';
import url from 'node:url';
import path__default from 'upath';
import 'path';
import 'bluebird';
import 'minimatch';
import '../utils/filemanager/case-path.mjs';
import { writefile } from '../utils/filemanager/writefile.mjs';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path__default.dirname(__filename);
const configWrapperFile = path__default.join(__dirname, '_config_wrapper.json');
if (!fs__default.existsSync(configWrapperFile))
    fs__default.writeFileSync(configWrapperFile, '{}');
const configWrapper = fs__default.existsSync(fs__default.readFileSync(configWrapperFile, 'utf-8'))
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
        fs__default.accessSync(configWrapperFile, fs__default.constants.W_OK);
        writefile(configWrapperFile, JSON.stringify(configWrapper, null, 2));
        this.emit('update');
    }
}

export { createConfig };
