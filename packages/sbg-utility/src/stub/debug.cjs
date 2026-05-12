function createDebug(namespace) {
  const debugFn = function debugFn() {
    return undefined;
  };

  debugFn.enabled = false;
  debugFn.namespace = namespace;
  debugFn.extend = function extend(subNamespace) {
    return createDebug(namespace ? namespace + ':' + subNamespace : subNamespace);
  };

  return debugFn;
}

module.exports = createDebug;
