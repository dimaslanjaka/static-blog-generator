/// <reference types="node" />
import { ChildProcess, ChildProcessWithoutNullStreams, SpawnOptions } from 'child_process';
import { Readable } from 'stream';
declare class spawner {
    static children: ChildProcessWithoutNullStreams[];
    private static onExit;
    /**
     * promises spawn
     * @param options
     * @param cmd
     * @param args
     * @returns
     * @example
     * spawner.promise({}, 'git', 'log', '-n', '1').then(console.log);
     * spawner.promise({stdio:'pipe'}, 'git', 'submodule', 'status').then(console.log);
     */
    static promise(options: null | SpawnOptions, cmd: string, ...args: string[]): Promise<{
        code: number;
        stdout: string[] | Readable;
        stderr: any;
    }>;
    /**
     * Spawn Commands
     * @param command node
     * @param args ['index.js']
     * @param callback callback for children process
     */
    static spawn(command: string, args?: string[], opt?: SpawnOptions, callback?: (path: ChildProcess) => any): ChildProcess;
    /**
     * Kill all ChildProcessWithoutNullStreams[]
     */
    static children_kill(): void;
}
export default spawner;
