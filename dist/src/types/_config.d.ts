import { initializeApp } from 'firebase/app';
import memoizee from 'memoizee';
import { Ngrok } from 'ngrok';
import '../a-core';
import project_config_data from './_config_project.json';
/**
 * Argument CLI reader
 */
export declare const argv: {
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
} | Promise<{
    [x: string]: unknown;
    _: (string | number)[];
    $0: string;
}>;
/** EXPORT PRIVATE AND PUBLIC CONFIGS */
export { root, theme_dir, theme_yml };
/**
 * process cwd unix style
 */
declare const root: string;
export declare const cwd: (() => string) & memoizee.Memoized<() => string>;
/** default project config */
export declare const default_project_config: Partial<import("./_config.default").SBGConfig>;
declare type projectImportData = typeof project_config_data;
interface PrivateProjectConfig {
    [keys: string]: any;
    firebase: Parameters<typeof initializeApp>[0];
    ngrok: Ngrok.Options;
    root: string;
    tmp: typeof tmp;
}
export declare type ProjectConfig = projectImportData & PrivateProjectConfig & typeof default_project_config & {
    env: string;
};
declare let config: ProjectConfig;
/**
 * Config Deployment
 */
export declare const configDeploy: import("./_config.default").SBGDeploy;
/**
 * Deployment Directory
 */
export declare const deployDir: string;
/**
 * is process using cache strategy?
 */
export declare const useCache: boolean;
/**
 * is verbose activated?
 */
export declare const verbose: any;
export declare const isDev: boolean;
/**
 * Public Source Post Dir ({@link config.source_dir})
 */
export declare const post_public_dir: string;
/**
 * Generated directory ({@link config.public_dir})
 */
export declare const post_generated_dir: string;
/**
 * `src-posts/` directory
 */
export declare const post_source_dir: string;
/**
 * path to temp folder
 * * cacheable
 * @param path file path inside temp folder
 * @returns
 */
export declare const tmp: (...path: string[]) => string;
/** THEME CONFIGS */
/** theme directory */
declare let theme_dir: string;
/** _config.yml object from theme directory */
declare const theme_yml: string;
/** merged theme config object */
export declare const theme_config: any;
export declare type ThemeOpt = typeof theme_config & {
    [key: string]: any;
};
/**
 * get config
 * @returns
 */
export declare function getConfig(): typeof project_config_data;
export default config;
export declare const project_config: ProjectConfig;
