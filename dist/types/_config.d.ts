import HexoConfig from 'hexo/HexoConfig';
declare const nocache: any;
declare const verbose: any;
export { verbose, nocache };
export interface ProjectConfig extends HexoConfig {
    [key: string]: any;
    /**
     * Source posts
     */
    post_dir: string;
    /**
     * Project CWD
     */
    cwd: string;
}
declare const _default: ProjectConfig;
export default _default;
/**
 * Hexo Generated Dir
 */
export declare const post_generated_dir: string;
/**
 * SBG Source Post Dir
 */
export declare const post_source_dir: string;
