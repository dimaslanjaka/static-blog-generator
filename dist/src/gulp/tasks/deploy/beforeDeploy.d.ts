/// <reference types="node" />
/**
 * process before push
 * @param cwd current working directory
 */
export declare function beforeDeploy(cwd: string): Promise<{
    code: number;
    stdout: string[] | import("stream").Readable;
    stderr: any;
}>;
