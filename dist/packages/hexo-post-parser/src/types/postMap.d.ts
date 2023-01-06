import { DeepPartial } from '../globals';
import { postMeta } from './postMeta';
import config from './_config';
export interface postMap extends Object {
    [key: string]: any;
    metadataString?: string;
    fileTree?: {
        source?: string;
        public?: string;
    };
    config?: DeepPartial<typeof config> | null;
    metadata?: postMeta;
    body?: string;
    content?: string;
}
