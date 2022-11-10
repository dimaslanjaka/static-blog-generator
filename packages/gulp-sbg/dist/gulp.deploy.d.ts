/// <reference types="node" />
/**
 * copy generated files to deploy dir
 * @returns
 */
export declare function copyGen(): NodeJS.ReadWriteStream;
/**
 * clean old archives (categories, tags, pagination)
 */
export declare function cleanOldArchives(): Promise<void>;
export declare function deployConfig(): {
    deployDir: string;
    config: import("./gulp.config").ProjConf;
    github: import("git-command-helper").default;
};
