import { dateMapper } from '../dateMapper';
import { postAuthor } from '../parsePost';
export interface postMeta {
    [key: string]: any;
    lang?: string;
    title: string;
    published?: boolean | 1 | 0;
    description?: string;
    wordcount?: number;
    id?: string;
    updated?: string | dateMapper;
    author?: string | postAuthor;
    date?: string | dateMapper;
    tags?: string[];
    categories?: string[];
    photos?: string[];
    cover?: string;
    thumbnail?: string;
    redirect?: string;
    url?: string;
    permalink?: string;
    type?: 'post' | 'page' | 'archive';
    layout?: string;
}
