import Bluebird from 'bluebird';
import { TaskFunctionCallback } from 'gulp';
/**
 * find broken images from html
 * @param html html string
 * @returns array of broken image url
 */
export default function findBrokenImages(html: string, config?: import("sbg-utility").ProjConf): Promise<string[]>;
export declare function hexoFindBrokenImages(done?: TaskFunctionCallback, config?: import("sbg-utility").ProjConf): Bluebird<unknown>;
export declare function findBrokenImagesGlob(config?: import("sbg-utility").ProjConf): void;
