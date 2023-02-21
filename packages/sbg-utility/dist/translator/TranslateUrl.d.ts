declare class TranslateUrl {
    base: URL;
    static main(args?: string[]): void;
    url(url: string): this;
    /**
     * append source lang
     * @param sl
     */
    from(sl: string): this;
    /**
     * Append target lang
     * @param tl
     */
    to(tl: string): this;
    toString(): string;
}
export default TranslateUrl;
