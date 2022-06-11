/**
 * Generic yaml parser
 * @param target
 * @returns
 */
export declare function yamlParse<T extends Record<string, unknown>>(target: string): T;
/**
 * build object to yaml
 * @param obj
 * @returns
 */
export declare function yamlBuild(obj: Record<string, any>): string;
