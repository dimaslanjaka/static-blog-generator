/// <reference types="node" />
import gulp from 'gulp';
import './gulp.clean';
import './gulp.deploy';
import './gulp.feed';
import './gulp.post';
import './gulp.safelink';
import './gulp.seo';
export declare function commitProject(finish: gulp.TaskFunctionCallback): void | import("bluebird")<string | void | Buffer>;
export default gulp;
