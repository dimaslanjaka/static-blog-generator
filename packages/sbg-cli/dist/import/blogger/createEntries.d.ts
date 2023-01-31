import jsdom from 'jsdom';
export declare function createEntries(xmlFile: string): {
    dom: jsdom.JSDOM;
    window: jsdom.DOMWindow;
    document: Document;
};
