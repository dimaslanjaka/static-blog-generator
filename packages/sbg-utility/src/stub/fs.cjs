// stub-fs.js
// This stub disables all fs and fs-extra methods for browser builds.

const noop = () => undefined;

module.exports = new Proxy(
  {},
  {
    get: () => noop,
    apply: () => noop
  }
);
