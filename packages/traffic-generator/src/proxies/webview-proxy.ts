import { session } from "electron";
import ads from "../__test__/data/hosts.json";

function webviewProxy(
  proxy: string,
  partition = "persist:webviewsession",
  callback?: (
    details: Electron.OnErrorOccurredListenerDetails,
    proxy: string,
    partition: string
  ) => any
) {
  let ses = session.defaultSession;
  if (typeof partition === "string") {
    ses = session.fromPartition(partition);
  }
  //console.log(ses.getUserAgent());
  ses.setProxy({ proxyRules: proxy }).then(() => {
    console.log(`injected [${partition}] with proxy: ${proxy}`);
  });

  ses.webRequest.onErrorOccurred((details) => {
    if (
      details.resourceType == "mainFrame" &&
      !isAds(new URL(details.url).hostname)
    ) {
      const errors = ["ERR_TIMED_OUT", "ERR_PROXY_CONNECTION_FAILED"];
      // check if the string has some of the terms
      const hasProxyError = errors.some((term) =>
        details.error.toUpperCase().includes(term)
      );

      if (hasProxyError) {
        if (typeof callback === "function") {
          console.log("Proxy error", details.resourceType, details.url);
          callback(details, proxy, partition);
        }
      } else {
        console.log("request error", details.error, details.url);
      }
    }
  });
}

/**
 * extract host from url
 * @param url
 * @returns
 */
function extracthost(url: string) {
  // if url is valid, parsing and return host
  if (/^https?:\/\//gs.test(url)) {
    return new URL(url).hostname;
  }
  return url;
}

export function isAds(url: string) {
  url = extracthost(url);
  console.log("ads", url, typeof ads[url] === "string");
  return typeof ads[url] === "string";
}

export default webviewProxy;
