if (typeof File === 'undefined') {
  global.File = class File extends Blob {
    constructor(parts, options) {
      super(parts, options);
      this.name = options && options.name ? options.name : '';
      this.lastModified = options && options.lastModified ? options.lastModified : Date.now();
    }
  };
}
