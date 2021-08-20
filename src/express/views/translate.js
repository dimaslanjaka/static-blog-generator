// Capture Translated
setTimeout(function () {
  const api = `${location.protocol}//${location.host}/receiver`;
  const target = decodeURIComponent(getParameterByName("url"));
  const markup = document.getElementById("trans");

  setTimeout(function () {
    const jsonData = JSON.stringify({
      html: markup.innerHTML,
      path: target,
      sl: getParameterByName("sl"),
      tl: getParameterByName("tl"),
    });
    fetch(api, {
      method: "post",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: jsonData,
    })
      .then((r) => r.json())
      .then((response) => {
        console.log(response);
      });
  }, 1500);
}, 3000);

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
