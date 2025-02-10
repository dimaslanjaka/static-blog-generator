/**
 * customized gulp options
 */
export type gulpOpt = Parameters<(typeof import('gulp'))['src']>[1] & {
  cwd?: string;
  ignore?: string[];
};

export interface NodeCallback {
  (error?: Error | null): void;
  (...args: any[]): any;
}
