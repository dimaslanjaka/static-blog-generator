const td = document.querySelectorAll("table#pet-tree");
Array.from(td).forEach((el) => {
  let text = el.innerHTML;
  text = text.replace(
    /HP\s/gmi,
    ' <img src="Pets/hp.webp" class="img-inline-text" title="Health Points" />'
  );
  text = text.replace(
    /ATK\s/gmi,
    '<img src="Recipes/attack.png" class="img-inline-text atk" title="attack" /> '
  );
  text = text.replace(
    /DEF\s/gmi,
    '<img src="Recipes/defense.png" class="img-inline-text def" title="defense" /> '
  );
  el.innerHTML = text;
});