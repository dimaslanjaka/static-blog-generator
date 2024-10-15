import { createEntries } from './createEntries';
export declare function parseEntries(c: ReturnType<typeof createEntries>): Promise<{
    dom: any;
    window: any;
    document: any;
}>;
