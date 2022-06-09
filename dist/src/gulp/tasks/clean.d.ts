import { TaskCallback } from 'undertaker';
/** clean generated folder */
export declare const clean_public: (done?: TaskCallback) => void;
/** clean posts from config.source_dir */
export declare const clean_posts: (done?: TaskCallback) => void;
/** clean temp folder */
export declare const clean_tmp: (done?: TaskCallback) => void;
/** clean database folder */
export declare const clean_db: (done?: TaskCallback) => void;
