document.addEventListener("DOMContentLoaded", function () {
  let table = new DataTable("table#pet-tree", {
    ajax: function (d, cb) {
      fetch("https://backend.webmanajemen.com/chimeraland/pets.php?json")
        .then((response) => response.json())
        .then((data) => {
          /**
           * @type {string[][]}
           **/
          const items = data.data;
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            /**
             * @type {string[]}
             **/
            const attr = item.attr;
            item.attr = attr
              .map((str) => {
                return `<li>${str}</li>`;
              })
              .join(" ");
            let quality = item.qty;
            quality = quality.replace(
              /HP/gmi,
              ' <img src="Pets/hp.webp" class="img-inline-text" title="Hit Points" />'
            );
            quality = quality.replace(
              /ATK/gmi,
              '<img src="Recipes/attack.png" class="img-inline-text atk" title="Attack" /> '
            );
            quality = quality.replace(
              /DEF/gmi,
              '<img src="Recipes/defense.png" class="img-inline-text def" title="Defense" /> '
            );
            item.qty = quality;
          }
          data.data = items;
          return cb(data);
        });
    },
    columns: [{ data: "name" }, { data: "qty" }, { data: "attr" }],
  });
});