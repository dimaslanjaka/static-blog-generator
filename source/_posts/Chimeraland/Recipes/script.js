const td = document.querySelectorAll("article table td");
Array.from(td).forEach((el) => {
  let text = el.innerHTML;
  text = text.replace(
    "fullness",
    '<img src="https://res.cloudinary.com/practicaldev/image/fetch/https://icon-library.com/images/stomach-icon/stomach-icon-29.jpg" class="img-inline-text" />'
  );
  text = text.replace(
    "atk",
    '<img src="Recipes/attack.jpg" class="img-inline-text atk" />'
  );
  el.innerHTML = text;
});