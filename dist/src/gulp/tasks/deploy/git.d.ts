/// <reference types="node" />
import { TaskCallback } from 'undertaker';
/**
 * GitHub Deployer
 * @param done
 * @returns
 */
export declare const deployerGit: (done?: TaskCallback) => Promise<NodeJS.ReadWriteStream>;
