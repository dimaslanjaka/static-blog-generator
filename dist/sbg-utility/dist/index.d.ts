import * as config from './config';
import * as gutils from './gulp-utils';
import * as utils from './utils';
export * from './config';
export * from './gulp-utils';
export * from './utils';
export { utils, config, gutils };
declare const sbgUtils: {
    chain(schedule: {
        callback: (...args: any[]) => any;
        opt?: {
            before?: ((...args: any[]) => any) | undefined;
            after?: ((...args: any[]) => any) | undefined;
        } | undefined;
    }[]): Promise<void>;
    escapeRegex(string: string, method?: "1" | "2"): string | undefined;
    capitalizer(str: string, moreSymbols?: ConcatArray<string>): string;
    streamToString(stream: NodeJS.ReadableStream): Promise<unknown>;
    bufferToString(array: Buffer): string;
    replacePath(source: string, toReplace: string, replacement?: string): Promise<string>;
    array_random<T extends any[]>(items: T): T[number];
    array_unique<T_1 extends any[]>(arr: T_1, field?: string | undefined): T_1;
    array_remove_empty<T_2 extends any[]>(arr: T_2): any[];
    default: typeof utils.logger.default;
    gulpCached: typeof gutils.gulpCached;
    gulpDebug: typeof gutils.gulpDebug;
    gulpLog: typeof gutils.gulpLog;
    getDefaultConfig(): {
        title: string;
        description: string;
        keywords: null;
        author: string;
        language: string;
        timezone: string;
        url: string;
        root: string;
        permalink: string;
        permalink_defaults: null;
        pretty_urls: {
            trailing_index: boolean;
            trailing_html: boolean;
        };
        source_dir: string;
        public_dir: string;
        tag_dir: string;
        archive_dir: string;
        category_dir: string;
        code_dir: string;
        i18n_dir: string;
        skip_render: null;
        new_post_name: string;
        default_layout: string;
        titlecase: boolean;
        filename_case: number;
        render_drafts: boolean;
        post_asset_folder: boolean;
        relative_link: boolean;
        future: boolean;
        highlight: {
            enable: boolean;
            line_number: boolean;
            auto_detect: boolean;
            tab_replace: string;
            wrap: boolean;
            hljs: boolean;
        };
        prismjs: {
            enable: boolean;
        };
        index_generator: {
            path: string;
            per_page: number;
            order_by: string;
        };
        default_category: string;
        meta_generator: boolean;
        date_format: string;
        time_format: string;
        updated_option: string;
        per_page: number;
        pagination_dir: string;
        include: null;
        exclude: null;
        ignore: null;
        theme: string;
        markdown: {
            preset: string;
            render: {
                html: boolean;
                xhtmlOut: boolean;
                langPrefix: string;
                breaks: boolean;
                linkify: boolean;
                typographer: boolean;
                quotes: string;
            };
            enable_rules: null;
            disable_rules: null;
            plugins: null;
            anchors: {
                level: number;
                collisionSuffix: string;
                permalink: boolean;
                permalinkClass: string;
                permalinkSide: string;
                permalinkSymbol: string;
                case: number;
                separator: string;
            };
        };
        browsersync: {
            logLevel: string;
            ghostMode: {
                scroll: boolean;
            };
            instanceName: string;
        };
        generator: {
            cache: boolean;
            verbose: boolean;
        };
        post_dir: string;
        deploy: {
            type: string;
            repo: string;
            branch: string;
            username: string;
            email: string;
            message: string;
        };
        tags: {
            lowercase: boolean;
            assign: null;
            mapper: null;
        };
        categories: {
            lowercase: boolean;
            assign: null;
            mapper: null;
        };
        external_link: {
            enable: boolean;
            field: string;
            safelink: {
                enable: boolean;
                exclude: string[];
                redirect: string[];
                type: string;
                password: string;
            };
            exclude: string[];
        };
    };
    getDefaultConfigYaml(): string;
    fetchConfig(fileYML: string): void;
    setConfig(obj: Record<string, any> | config.ProjConf): config.ProjConf;
    getConfig(): config.ProjConf;
    deployConfig(): {
        deployDir: string;
        github: import("git-command-helper").default;
    };
    commonIgnore: string[];
    projectIgnores: string[];
    createConfig: typeof config.createConfig;
    array: typeof utils.array;
    debug: typeof utils.debug;
    filemanager: typeof utils.filemanager;
    logger: typeof utils.logger;
    noop: typeof utils.noop;
    envNunjucks: typeof utils.envNunjucks;
    object: typeof utils.object;
    scheduler: typeof utils.scheduler;
    stream: typeof utils.stream;
    string: typeof utils.string;
};
export default sbgUtils;
//# sourceMappingURL=index.d.ts.map