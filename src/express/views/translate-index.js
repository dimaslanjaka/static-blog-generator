/**
 * Browser client
 */
/**
 * ngrok url
 * @type {string}
 */
const ngrok_host = document.getElementById("ngrok-host").innerText;
const indicator = document.getElementById("ngrok-stats");
const sukses = function () {
  indicator.classList.remove("text-success", "text-danger");
  indicator.classList.add("text-success");
  indicator.innerHTML = '<i class="fas fa-check"></i> UP';
};
const gagal = function () {
  indicator.classList.remove("text-success", "text-danger");
  indicator.classList.add("text-danger");
  indicator.innerHTML = '<i class="fas fa-times"></i> DOWN';
  setTimeout(function () {
    // reload if ngrok host down
    history.go(0);
  }, 1500);
};
const testNgrok = function () {
  fetch("/proxy?url=" + ngrok_host)
    .then((response) => {
      if (response.status !== 200) {
        clearInterval(interval);
        gagal();
      } else {
        sukses();
      }
    })
    .catch(function (error) {
      clearInterval(interval);
      gagal();
    });
};
testNgrok();
let interval = setInterval(testNgrok, 5000);

// grep ngrok url as external localhost (mirror)
const trs = document.querySelectorAll("[translate-url]");
for (let i = 0; i < trs.length; i++) {
  const tr = trs.item(i);
  const dataUrl = tr.getAttribute("translate-url");
  const sourceLang = tr.getAttribute("translate-sl");
  const urlWrapper = tr.querySelectorAll("[id^='translate-urls-']"); // translator url wrapper
  const urlTrans = [];
  if (urlWrapper.length) {
    // target languages
    const targetLang = ["id", "en", "zh-CN", "zh-TW", "es", "de", "ko", "ms"];
    // @todo parse each target languages from article language
    //new TranslateUrl().from("id").to("en").url(decodeURIComponent(local))
    targetLang.forEach(function (lang) {
      if (lang === sourceLang) return;
      const build = new URL(`${location.protocol}//${location.host}/translate`);
      build.searchParams.append("tl", lang);
      build.searchParams.append("sl", sourceLang);
      build.searchParams.append("url", dataUrl);
      urlTrans.push(
        `<a href="${build.href}" class="mr-2 badge rounded-pill bg-info text-dark">${sourceLang} > ${lang}</a>`
      );
    });
    urlWrapper.item(0).innerHTML = urlTrans.join(" ");
  }
}
