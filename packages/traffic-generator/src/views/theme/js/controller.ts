document.querySelectorAll("a").forEach((a) => {
  const href = a.href;
  if (a.hasAttribute("new-window")) {
    a.addEventListener("click", (evt) => {
      evt.preventDefault();
      window.sendToElectron("new-window", href);
    });
  }
});

