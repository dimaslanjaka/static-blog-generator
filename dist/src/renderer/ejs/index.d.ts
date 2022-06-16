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
export declare function renderFile(file: string, opts?: EJSOption): Promise<string>;
declare function render(content: string, opts?: EJSOption): string;
declare const ejs_object: {
    ejs: typeof ejs;
    helpers: any;
    renderFile: typeof renderFile;
    resolveInclude: typeof ejs.resolveInclude;
    compile: typeof ejs.compile;
    render: typeof render;
    clearCache: typeof ejs.clearCache;
    escapeXML: typeof ejs.escapeXML;
    VERSION: string;
    name: "ejs";
    cache: ejs.Cache;
    fileLoader: ejs.fileLoader;
    localsName: string;
    openDelimiter: string;
    closeDelimiter: string;
    delimiter: string;
    promiseImpl: PromiseConstructorLike;
    Template: typeof ejs.Template;
};
export default ejs_object;
export { helpers };
