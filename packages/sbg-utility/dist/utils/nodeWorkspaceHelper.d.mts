/**
 * search yarn root workspace folder
 * @param ctx option with property `base_dir`
 */
export declare function findYarnRootWorkspace(ctx: {
    base_dir: string;
}): string | null;
/**
 * Resolve the path of a command binary from node_modules/.bin.
 *
 * @param commandName - The name of the command to resolve.
 * @returns The resolved command path or the original command name if not found.
 */
export declare function resolveCommand(commandName: string): string;
export declare const cmd: typeof resolveCommand;
export default findYarnRootWorkspace;
