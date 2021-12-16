const ipcRenderer = require("electron").ipcRenderer;
const path = require("path");
const { writeFileSync, existsSync, mkdirSync } = require("fs");

function parseMinecraftShader(params, saveLocation, href) {
  const title = document.querySelector(".jeg_post_title").textContent;
  const excerpt = document.querySelector(".jeg_post_subtitle").textContent;
  const content = document.documentElement.outerHTML;

  const contentInfo = {
    title: title,
    subtitle: excerpt,
    sl: params.sl,
    hl: params.hl,
    href: href
  };
  if (!existsSync(path.dirname(saveLocation))) {
    mkdirSync(path.dirname(saveLocation), { recursive: true });
  }
  writeFileSync(saveLocation + ".html", content);
  writeFileSync(saveLocation + ".json", JSON.stringify(contentInfo));
  ipcRenderer.send("html-content", saveLocation, content);
}

/// check scroll end/bottom of page

function atEnd() {
  var c = [
    document.scrollingElement.scrollHeight,
    document.body.scrollHeight,
    document.body.offsetHeight
  ].sort(function (a, b) {
    return b - a;
  }); // select longest candidate for scrollable length
  return window.innerHeight + window.scrollY + 2 >= c[0]; // compare with scroll position + some give
}

function scrolling() {
  if (atEnd()) {
    console.clear();
    //console.log("end scroll");

    const href = new URL(
      location.href
        .replace(".translate.goog", "")
        .replace("-", ".")
        .replace(/_x_tr_/gm, "")
    );
    const urlSearchParams = new URLSearchParams(href.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const saveLocation = path.join(
      "build/translated",
      params.sl,
      params.tl,
      href.pathname.replace(/(\/|.html)$/gm, "")
    );

    //console.log(saveLocation);

    parseMinecraftShader(params, saveLocation, href);
  }
}

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    document.body.innerHTML += '<div id="end-of-page"></div>';
    document.body.dispatchEvent(new Event("scroll"));
    window.addEventListener("scroll", scrolling, { passive: true });
    scrollToSmoothly(document.getElementById("end-of-page").offsetTop, 30000);
  }
};

//// auto scroll

function scrollToSmoothly(pos, time) {
  var currentPos = window.pageYOffset;
  var start = null;
  if (time == null) time = 500;
  (pos = +pos), (time = +time);
  window.requestAnimationFrame(function step(currentTime) {
    start = !start ? currentTime : start;
    var progress = currentTime - start;
    if (currentPos < pos) {
      window.scrollTo(0, ((pos - currentPos) * progress) / time + currentPos);
    } else {
      window.scrollTo(0, currentPos - ((currentPos - pos) * progress) / time);
    }
    if (progress < time) {
      window.requestAnimationFrame(step);
    } else {
      window.scrollTo(0, pos);
    }
  });
}
