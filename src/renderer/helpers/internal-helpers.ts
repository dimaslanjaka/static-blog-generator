import config from '../../types/_config';

export const internal_helpers = {
  iif: function <T>(cond: boolean, value: T): T {
    if (cond) return value;
  },
  url_fix: (str: string) => {
    const u = new URL(str);
    // remove multiple slashes
    u.pathname = u.pathname.replace(/\/+/, '/');
    return u.toString();
  },
  url_for: (str: string) => {
    let homepage = config.url;
    homepage += str.replace(/\/+/, '/');
    return new URL(homepage).toString();
  }
};
