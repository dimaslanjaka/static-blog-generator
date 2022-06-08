import { postMap } from '../../../parser/post/parsePost';
export interface Label {
    /**
     * Tag name
     */
    name: string;
    /**
     * Tag path
     */
    path: string;
    /**
     * Tag url
     */
    url: string;
}
/**
 * list tag of page
 * @param page page object
 * @returns array of tags
 * @example
 * ```html
 * <% tags(page).forEach(tag => { %>
 * <!-- full url -->
 * tag url: <%- tag.url %>
 * <!-- label name -->
 * tag name: <%- tag.name %>
 * <!-- just pathname without base url -->
 * tag pathname: <%- tag.pathname %>
 * <% }) %>
 * ```
 */
export declare function tags(page: postMap): Label[];
/**
 * extract categories from page
 * @param page
 * @returns array of object same as {@link tags}
 * @see {@link tags}
 */
export declare function categories(page: postMap): Label[];
