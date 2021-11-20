/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// noinspection JSIgnoredPromiseFromCall

window.onload = () => {
  /**
   * @typedef {Element|import('electron').webviewTag}
   * @type {Element|import('electron').webviewTag}
   */
  const webview = document.querySelector("webview");
  const indicator = document.querySelector(".indicator");
  /**
   * @type {HTMLInputElement}
   */
  const addrBar = document.getElementById("addr-bar");

  webview.addEventListener("ipc-message", function (e) {
    if (e.channel === "html-content") {
      const html_contents = e.args[0];
      console.log(html_contents);
    }
  });

  let firstLoad = true;
  webview.addEventListener("dom-ready", () => {
    // clear log every page
    //console.clear();

    // load webview default from url bar
    if (firstLoad) {
      firstLoad = false;
      /*setTimeout(function () {
        webview.loadURL(addrBar.value);
      }, 1500);*/
    } else {
      addrBar.value = webview.getURL();
    }

    // listen url address enter
    addrBar.addEventListener("keydown", function (event) {
      const addrBarValue = this.value;
      if (event.key == "Enter") {
        if (/https?:\/\//gs.test(addrBarValue)) {
          webview.loadURL(addrBarValue);
        } else {
          webview.loadURL("http://google.com/search?q=" + addrBarValue);
        }
      }
    });

    if (indicator) {
      const loadstart = () => {
        indicator.innerText = "loading...";
      };

      const loadstop = () => {
        indicator.innerText = "";
      };

      webview.addEventListener("did-start-loading", loadstart);
      webview.addEventListener("did-stop-loading", loadstop);
    }
  });
};
