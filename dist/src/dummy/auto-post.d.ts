import memoizee from 'memoizee';
export declare const generateDummyPosts: typeof _generateDummyPosts & memoizee.Memoized<typeof _generateDummyPosts>;
declare function _generateDummyPosts(n?: number): Promise<string[]>;
export {};
