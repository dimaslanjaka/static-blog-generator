import { JSDOM } from 'jsdom';
declare class jdom {
    instances: {
        [key: string]: JSDOM;
    };
    instance: JSDOM;
    current: string;
    close(): void;
    parse: (str: string) => Document;
    /**
     * serialize html and close instance
     * @returns
     */
    serialize(): string;
    body(): HTMLElement;
    toString(): string;
}
export default jdom;
