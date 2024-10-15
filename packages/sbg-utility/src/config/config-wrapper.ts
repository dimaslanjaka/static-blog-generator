import EventEmitter from 'events';
import fs from 'fs-extra';
import url from 'node:url';
import path from 'upath';
import { writefile } from '../utils/filemanager';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configWrapperFile = path.join(__dirname, '_config_wrapper.json');
if (!fs.existsSync(configWrapperFile)) fs.writeFileSync(configWrapperFile, '{}');
const configWrapper: Record<string, any> = fs.existsSync(fs.readFileSync(configWrapperFile, 'utf-8'))
  ? JSON.parse(configWrapperFile)
  : {};

interface createConfigEvents {
  add: (obj: Record<string, any>) => void;
  delete: (changedCount: number) => void;
  update: () => void;
}
export declare interface createConfig<T extends Record<string, any>> {
  on<U extends keyof createConfigEvents>(event: U, listener: createConfigEvents[U]): this;
  emit<U extends keyof createConfigEvents>(event: U, ...args: Parameters<createConfigEvents[U]>): boolean;
  get<U extends Record<string, any>>(): T & U;
}

/**
 * Create/Update config wrapper
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class createConfig<T extends Record<string, any>> extends EventEmitter {
  cname: string;
  /**
   * Create/Update config wrapper
   * @param name config name
   * @param value initial config value
   */
  constructor(name: string, value: Record<string, any>) {
    super();
    // assign config name
    this.cname = name;
    // add config
    if (!configWrapper[name]) {
      configWrapper[name] = value;
      this.emit('add', value);
    } else {
      // update config
      this.update(value);
    }
  }
  /**
   * get config
   * @returns
   */
  get<U extends Record<string, any>>() {
    if (!configWrapper[this.cname]) configWrapper[this.cname] = {};
    return configWrapper[this.cname] as T & U;
  }
  /**
   * update config
   * @param value new values should be merged with old values using shallow object merge
   */
  update(value: Record<string, any>) {
    configWrapper[this.cname] = Object.assign({}, this.get(), value);
    fs.accessSync(configWrapperFile, fs.constants.W_OK);
    writefile(configWrapperFile, JSON.stringify(configWrapper, null, 2));
    this.emit('update');
  }
}
