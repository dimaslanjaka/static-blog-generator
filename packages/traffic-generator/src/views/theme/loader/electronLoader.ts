import "../../../../../hexo-seo/packages/js-prototypes/src/globals";
export interface ldloadOptions {
  /**
   * Handle on root element ({@see {@link Parameters<ParentNode.querySelector>[0]}} pattern), using `document`
   */
  root: string;
}

/**
 * Loading.io initializer
 */
export default class ldloader {
  loaders: NodeListOf<Element> | HTMLCollectionOf<Element>;
  constructor(opt?: ldloadOptions) {
    let dom: Document | Element | HTMLElement = document;
    if (typeof opt == "object") {
      if (opt.root) dom = document.querySelector(opt.root);
    }
    this.loaders = dom.getElementsByClassName("ldld");
    console.log("found loaders", this.loaders.length);
  }
  /**
   * Direct trigger loader element
   * @param el Single DOM Element
   * @param activate true to activate
   * @returns
   */
  trigger = (el: Element | HTMLElement, activate: boolean) => {
    return el.classList.toggle("running", activate);
  };

  /**
   * Activate single id (by id)
   * @param id id element
   * @returns
   */
  single = (id: string, activate: boolean) => {
    const getid = document.querySelector("#" + id);
    if (getid) return this.trigger(getid, activate);
  };

  /**
   * identify id for {@link ldloader.on} and {@link ldloader.off}
   * @param id
   * @param activate
   * @returns
   */
  private identify(
    id: string[] | string | Electron.WebviewTag,
    activate: boolean
  ) {
    const self = this;
    if (typeof id == "string") {
      return this.single(id, activate);
    } else if (Array.isArray(id)) {
      return id.map((uid) => self.single(uid, activate));
    } else {
      return false;
    }
    return false;
  }

  /**
   * Trigger ALL for {@link ldloader.on} and {@link ldloader.off}
   * @param activate
   * @returns
   */
  private all(activate: boolean) {
    const results: boolean[] = [];

    for (let index = 0; index < this.loaders.length; index++) {
      const element = this.loaders[index];
      results.push(this.trigger(element, activate));
    }

    return results;
  }

  /**
   * Activate
   * @param id select with custom id (multiple with array strings), null = all
   */
  on(id: string[] | string | Electron.WebviewTag = null) {
    if (id) {
      return this.identify(id, true);
    }

    return this.all(true);
  }

  /**
   * Deactivate
   * @param id select with custom id (multiple with array strings), default null = all
   * @returns
   */
  off(id: string | string[] | Electron.WebviewTag = null) {
    if (id) {
      return this.identify(id, true);
    }
    return this.all(false);
  }
}

export { ldloader as ldLoader };
