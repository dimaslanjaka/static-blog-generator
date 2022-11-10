import './gulp.safelink';
/**
 * copy generated files to deploy dir
 * @returns
 */
export declare function copyGen(): any;
/**
 * clean old archives (categories, tags, pagination)
 */
export declare function cleanOldArchives(): Promise<void>;
