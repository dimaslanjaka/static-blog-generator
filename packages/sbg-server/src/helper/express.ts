import express from 'express';

export interface DynamicExpressRequest extends express.Request {
  [key: string]: any;
}

export interface DynamicExpressResponse extends express.Response {
  [key: string]: any;
}
export interface DynamicExpressNext extends express.NextFunction {
  [key: string]: any;
}

/**
 * express async handler helper
 * @param fn
 * @returns
 */
export const expressMiddlewareHandler =
  (fn: (...args: any) => any) =>
  (
    req: DynamicExpressRequest,
    res: DynamicExpressResponse,
    next: DynamicExpressNext
  ) => {
    const result = fn(req, res, next);

    // Check if the returned value is a promise
    if (result && typeof result.then === 'function') {
      result.catch(next);
    } else {
      // If it's not a promise, move to the next middleware
      next();
    }
  };
