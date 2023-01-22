import EventEmitter from 'events';
import fs from 'fs-extra';
import path from 'upath';
import { writefile } from '../utils/filemanager';

const configWrapperFile = path.join(__dirname, '_config_wrapper.json');
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
 * @param name
 * @param value
 * @returns
 */
export class createConfig<T extends Record<string, any>> extends EventEmitter {
  cname: string;
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
  get<U extends Record<string, any>>() {
    if (!configWrapper[this.cname]) configWrapper[this.cname] = {};
    return configWrapper[this.cname] as T & U;
  }
  update(value: Record<string, any>) {
    configWrapper[this.cname] = Object.assign({}, this.get(), value);
    if (fs.access(configWrapperFile, fs.constants.W_OK)) {
      writefile(configWrapperFile, JSON.stringify(configWrapper, null, 2));
      this.emit('update');
    }
  }
}
