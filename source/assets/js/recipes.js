console.clear();

CalculateTR(document.getElementById("char-dish"));
CalculateTR(document.getElementById("fairy-dish"));

/**
 * Calculate TR
 * @param {HTMLTableElement} table
 */
function CalculateTR(table) {
  let identifier = table.hasAttribute("id") ? table.id : "-";
  console.log(`Start Calculating Table ${identifier}`);
  let tr = table.getElementsByTagName("tr");
  if (tr.length > 0)
    for (i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td"),
        str,
        thirdTD = typeof td[3] != "undefined";

      if (thirdTD) {
        str = td[3].innerText;
        console.log(str);
        if (/[+\(\)]/gm.test(str)) {
          str = str.trim().replaceAll(/x/gs, "*");
          td[3].innerText = eval(str);
        }
      }
    }
}
