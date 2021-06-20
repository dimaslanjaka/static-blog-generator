onload = () => {
  /**
   * @type {Element|import('electron).webviewTag}
   */
  const webview = document.querySelector("webview");
  const indicator = document.querySelector(".indicator");
  /**
   * @type {HTMLInputElement}
   */
  const addrBar = document.getElementById("addr-bar");

  // load webview default from url bar
  let firstLoad = true;
  webview.addEventListener("dom-ready", () => {
    if (firstLoad) {
      firstLoad = false;
      setTimeout(function () {
        webview.loadURL(addrBar.value).then((r) => console.log(r));
      }, 1500);
    } else {
      addrBar.value = webview.getURL();
    }
  });

  // listen url address enter
  addrBar.addEventListener("keydown", function (event) {
    const val = this.value;
    if (event.key === "Enter") {
      console.log(val);
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
};
