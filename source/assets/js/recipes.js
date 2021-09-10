console.clear();

let table = document.getElementsByTagName("table");
for (i = 0; i < table.length; i++) {
  CalculateTR(table[i]);
}

/**
 * Calculate TR
 * @param {HTMLTableElement} table
 */
function CalculateTR(table) {
  let tr = table.getElementsByTagName("tr");
  if (tr.length > 0)
    for (i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td"),
        str;
      if (typeof td[3] != "undefined") {
        str = td[3].innerText;
        if (str.includes("+")) {
          str = str.trim().replaceAll(/x/gs, "*");
          td[3].innerText = eval(str);
          console.log(str);
        }
      }
    }
}
