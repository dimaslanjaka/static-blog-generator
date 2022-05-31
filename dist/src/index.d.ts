/// <reference types="node" />
import { gulpInlineStyle } from './gulp/tasks/copy/remove-inline-style';
import './gulp/tasks/deploy';
import './gulp/tasks/generate';
declare const properties: {
    copyPosts: (_done?: import("undertaker").TaskCallback, cpath?: string) => NodeJS.ReadWriteStream;
    copyAssets: () => NodeJS.ReadWriteStream | Promise<void>;
    gulpInlineStyle: typeof gulpInlineStyle;
    clean_db: (done?: import("undertaker").TaskCallback) => void;
    clean_posts: (done?: import("undertaker").TaskCallback) => void;
    clean_public: (done?: import("undertaker").TaskCallback) => void;
    clean_tmp: (done?: import("undertaker").TaskCallback) => void;
};
export { clean_db, clean_posts, clean_public, clean_tmp } from './gulp/tasks/clean';
export { copyPosts } from './gulp/tasks/copy';
export { copyAssets } from './gulp/tasks/copy/assets';
export default properties;
