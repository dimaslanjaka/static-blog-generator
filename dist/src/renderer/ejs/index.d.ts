import * as ejs from 'ejs';
import { postMap } from '../../parser/post/parsePost';
import { DynamicObject } from '../../types';
import config, { ThemeOpt } from '../../types/_config';
import * as author from './helper/author';
import * as date from './helper/date';
import * as excerpt from './helper/excerpt';
import * as keywords from './helper/keywords';
import * as tag from './helper/labels';
import * as locale from './helper/locales';
import * as thumbnail from './helper/thumbnail';
declare const internal_helpers: {
    iif: <T>(cond: boolean, value: T) => T;
    url_fix: (str: string) => string;
    url_for: (str: string) => string;
};
declare type helper_types = typeof tag & typeof keywords & typeof excerpt & typeof thumbnail & typeof locale & typeof author & typeof date & typeof internal_helpers & DynamicObject;
declare const helpers: helper_types;
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
    helpers: helper_types;
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
