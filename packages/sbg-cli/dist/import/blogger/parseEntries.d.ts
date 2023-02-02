/// <reference types="jsdom" />
/// <reference types="jsdom" />
import { createEntries } from './createEntries';
export declare function parseEntries(c: ReturnType<typeof createEntries>): Promise<{
    dom: import("jsdom").JSDOM;
    window: import("jsdom").DOMWindow;
    document: Document;
}>;
