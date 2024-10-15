declare const mappedConfig: typeof import('./_config.json');
export type importConfig = typeof mappedConfig;
/**
 * get default configuration
 * @returns
 */
export declare function getDefaultConfig(): importConfig;
/**
 * get default _config.yml
 * @returns
 */
export declare function getDefaultConfigYaml(): string;
export {};
