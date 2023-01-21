/**
 * Post author object type
 */
export interface postAuthor extends Object {
    [key: string]: any;
    /**
     * Author name
     */
    name?: string;
    /**
     * Author email
     */
    email?: string;
    /**
     * Author website url
     */
    link?: string;
}
