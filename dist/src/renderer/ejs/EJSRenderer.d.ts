import { postMap } from '../../parser/post/parsePost';
interface Override extends ejs.Options {
    [key: string]: any;
}
/**
 * EJS Renderer Engine
 * @param parsed
 * @param override override {@link Override} object ejs options {@link ejs.Options}, page data {@link postMap} default empty object
 * @returns rendered promise (Promise\<string\>)
 * renderer injection
 * ```js
 * renderer(parsed, {
 *  // new helper available on ejs layout
 *  newhelper: function () {
 *    return 'new helper';
 *  }
 * })
 * ```
 * ejs
 * ```html
 * <%- newhelper() %>
 * ```
 */
export declare function EJSRenderer(parsed: Partial<postMap>, override?: Override): Promise<string>;
export {};
