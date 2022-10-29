declare type importConfig = typeof import('./_config.json');
export interface ProjConf extends importConfig {
    [key: string]: any;
}
declare const ProjectConfig: ProjConf;
export default ProjectConfig;
