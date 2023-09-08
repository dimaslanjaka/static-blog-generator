/**
 * parse version string
 */
export class semver {
    /**
     * @param {{ version: string }|string} opt
     * @returns
     */
    constructor(opt: string | {
        version: string;
    });
    result: {
        major: string;
        minor: string;
        patch: string;
    };
    toString(): string;
}
/**
 * increment version range
 * @param {ConstructorParameters<typeof semver>[0]} opt
 * @param {keyof ReturnType<semver['getResult']>} by
 */
export function semverIncrement(opt: ConstructorParameters<typeof semver>[0], by: keyof ReturnType<semver['getResult']>): semver;
