import Bluebird from 'bluebird';
import { TaskCallback } from 'undertaker';
import './gulp.clean';
import './gulp.feed';
import './gulp.post';
import './gulp.safelink';
export declare function commitProject(finish: TaskCallback): void | Bluebird<any>;
export declare function getUntrackedSitemap(): Bluebird<unknown>;
