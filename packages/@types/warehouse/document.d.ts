export = Document;
declare class Document {
    /**
     * Document constructor.
     *
     * @param {object} data
     */
    constructor(data: object);
    /**
     * Saves the document.
     *
     * @param {function} [callback]
     * @return {Promise}
     */
    save(callback?: Function): Promise<any>;
    /**
     * Updates the document.
     *
     * @param {object} data
     * @param {function} [callback]
     * @return {Promise}
     */
    update(data: object, callback?: Function): Promise<any>;
    /**
     * Replaces the document.
     *
     * @param {object} data
     * @param {function} [callback]
     * @return {Promise}
     */
    replace(data: object, callback?: Function): Promise<any>;
    /**
     * Removes the document.
     *
     * @param {function} [callback]
     * @return {Promise}
     */
    remove(callback?: Function): Promise<any>;
    /**
     * Returns a plain JavaScript object.
     *
     * @return {object}
     */
    toObject(): object;
    /**
     * Returns a string representing the document.
     *
     * @return {String}
     */
    toString(): string;
    /**
     * Populates document references.
     *
     * @param {String|Object} expr
     * @return {Document}
     */
    populate(expr: string | any): Document;
}
//# sourceMappingURL=document.d.ts.map