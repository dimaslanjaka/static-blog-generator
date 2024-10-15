export declare const isWindows: boolean;
interface trueCasePathNewCallbackOpt {
    /** return as unix style path */
    unix?: boolean;
}
export declare const trueCasePathSync: (filePath: string, basePath?: string | trueCasePathNewCallbackOpt, cbOpt?: trueCasePathNewCallbackOpt) => string;
export declare const trueCasePath: (filePath: string, basePath?: string | trueCasePathNewCallbackOpt, cbOpt?: trueCasePathNewCallbackOpt) => string;
export {};
