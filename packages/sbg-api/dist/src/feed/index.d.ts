import Bluebird from 'bluebird';
import gulp, { TaskFunctionCallback } from 'gulp';
/**
 * generate feed with hexo
 * @param done
 * @param config
 */
export declare function hexoGenerateFeed(done?: gulp.TaskFunctionCallback, config?: import("sbg-utility").ProjConf): Bluebird<unknown>;
/** gulp task */
export declare function gulpHexoGeneratedFeed(callback?: TaskFunctionCallback): Bluebird<unknown>;
