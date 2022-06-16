import * as ejs from 'ejs';
import { postMap } from '../../parser/post/parsePost';
import { DynamicObject } from '../../types';
import config, { ThemeOpt } from '../../types/_config';
import { helpers } from '../helpers';
interface EJSOption extends ejs.Options, DynamicObject {
    _?: typeof helpers;
    page?: Partial<postMap>;
    config?: typeof config;
    theme?: ThemeOpt;
}
export declare function EJSRenderFile(file: string, opts?: EJSOption): Promise<string>;
export declare function EJSRenderString(content: string, opts?: EJSOption): string;
declare const ejs_object: any;
export default ejs_object;
export { helpers };
