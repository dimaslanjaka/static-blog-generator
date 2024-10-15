/**
 * parse version string
 */
declare class semver {
    result: {
        [s: string]: any;
    } | ArrayLike<any>;
    /**
     * @param opt
     * @returns
     */
    constructor(opt: string | {
        version: string;
    });
    toString(): string;
}
/**
 * increment version range
 * @param opt
 * @param by
 */
declare function semverIncrement(opt: {
    version: string;
} | string, by: string | number): semver;
export { semver, semverIncrement };
