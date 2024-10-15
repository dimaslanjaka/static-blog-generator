export declare function fixDriveLetter(filePath: string): string;
/**
 * UNIX join path with true-case-path
 * @description normalize path and make drive letter uppercase
 * @param str
 * @returns Unix Style Path
 */
export declare function normalizePath(...str: string[]): string;
/**
 * UNIX join path with true-case-path
 * @description normalize path and make drive letter uppercase
 * @param str
 * @returns Unix Style Path
 */
export declare function normalizePathUnix(...str: string[]): string;
/**
 * remove base path
 * @param target path to remove
 * @param toRemove cwd
 */
export declare function removeCwd(target: string, toRemove: string): string;
/**
 * UNIX join path with auto create dirname when not exists
 * @param path
 * @returns
 */
export declare function joinSolve(...paths: string[]): string;
export default normalizePath;
