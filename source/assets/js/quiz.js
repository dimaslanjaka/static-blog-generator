console.clear();

// automated test
setTimeout(function () {
  let inputSearch = document.getElementById("search-questions");
  const randx = ["i", "a", "p", "j"];
  var keyword = randx[Math.floor(Math.random() * randx.length)];
  inputSearch.value = keyword;
  inputSearch.dispatchEvent(new Event("keyup"));
}, 1500);

/*** MAIN SCRIPT START ***/

//this function will work cross-browser for loading scripts asynchronously
function loadJScript(src, callback) {
  var s, r, t;
  r = false;
  s = document.createElement("script");
  s.type = "text/javascript";
  s.src = src;
  s.onload = s.onreadystatechange = function () {
    //console.log( this.readyState ); //uncomment this line to see which ready states are called.
    if (!r && (!this.readyState || this.readyState == "complete")) {
      r = true;
      callback();
    }
  };
  t = document.getElementsByTagName("script")[0];
  t.parentNode.insertBefore(s, t);
}

function uniqArr(a) {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const quizUrls = [
  "https://dimaslanjaka-cors.herokuapp.com/https://raw.githubusercontent.com/dimaslanjaka/dimaslanjaka.github.io/compiler/source/assets/tlon/Quiz/quiz.txt",
  "https://dimaslanjaka-cors.herokuapp.com/http://backend.webmanajemen.com/tlon/quiz.txt",
];
let quizSrc = [];

function jQueryMethod() {
  // ul questions
  const questions = document.getElementById("questions");
  const inputSearch = document.getElementById("search-questions");
  const O_only = document.getElementById("O_only");

  // searcher
  const searchLi = function (filter) {
    let listQuiz = jQuery("ul[id*='questions'] li");
    listQuiz.each(function (index) {
      const searchWild =
        jQuery(this)
          .text()
          .search(new RegExp(escapeRegExp(filter), "gmi")) < 0;
      const searchFirst =
        jQuery(this)
          .text()
          .search(new RegExp("^" + escapeRegExp(filter), "gmi")) < 0;
      if (searchFirst) {
        jQuery(this).hide();
      } else {
        jQuery(this).show();
        // move to first position
        jQuery(this).prependTo(jQuery("ul[id*='questions']"));
      }
      if (searchWild) {
        jQuery(this).hide();
      } else {
        jQuery(this).show();
      }
    });
  };

  const processLi = function () {
    jQuery("#search-questions").keyup(function () {
      searchLi(jQuery(this).val());
    });
  };

  // transform array to li
  const transformArray2Li = function () {
    // clean orphan text
    $("#questions").text("");
    // remove existing li's
    $("#questions li").remove();

    for (let i = 0; i < quizSrc.length; i++) {
      let str = quizSrc[i];
      let isTrue = /\(O\)$/i;
      const li = document.createElement("li");
      li.innerHTML = str;
      if (isTrue.test(str)) {
        li.setAttribute("class", "isTrue");
      } else {
        li.setAttribute("class", "isFalse");
      }
      document.getElementById("questions").appendChild(li);
    }
  };

  // get new question sources
  quizUrls.forEach(function (quizUrl) {
    console.log(quizUrl);
    $.get(quizUrl).then(function (data) {
      if (data) {
        // split newLine from retrieved text into array
        const split = data.split("\n");
        // trim
        quizSrc.map(function (str) {
          return str.trim();
        });
        // merge and remove duplicates
        quizSrc = uniqArr(quizSrc.concat(split));
        // trim
        quizSrc.map(function (str) {
          return str.trim();
        });
        // transform
        transformArray2Li();
      }
      processLi();
    });
  });

  // filter only (O)
  $("#O_only").on("change", function (e) {
    e.preventDefault();
    if (this.checked) {
      $(".isFalse").remove();
    } else {
      transformArray2Li();
    }

    if (inputSearch && inputSearch.value && inputSearch.value.trim().length > 0) {
      searchLi(inputSearch.value);
    }
  });

  // form add quiz
  /*
  $("form#addQuiz").on("submit", function (e) {
    e.preventDefault();
    let t = $(this);
    $.ajax({
      url: t.attr("action"),
      type: "post",
      //dataType: "json",
      data: t.serialize(),
      success: function (data) {
        console.log(data);
      }
    });
  });
  */
}

loadJScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js", jQueryMethod);
