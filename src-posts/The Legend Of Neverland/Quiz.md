---
title: Quiz The Legend Of Neverland

subtitle: "Quiz questions and the answers. The Legend Of Neverland Event."

lang: en

date: 2021-8-16

type: post

tags:
  - Quiz
  - Event

author:
  nick: "Maulinda Agustina"
  link: "<Your Profile Link Here>"

category:
  - Games
  - The Legend Of Neverland

comments: true

cover: "https://res.cloudinary.com/dimaslanjaka/image/fetch/https://findurthing.com/wp-content/uploads/2021/01/SCENIC-QUIZ.jpg"
location: Indonesia
---

<style>
[id*="questions-filter"] li:not([data-id]) {
  display: none;
}

[id*="questions"] li {
  display: block;
  /*text-transform: lowercase;*/
}

[id*="questions"] li:first-letter {
  text-transform: uppercase;
}

input[type="text"] {
  width: 90%;
  border: 2px solid #aaa;
  border-radius: 4px;
  margin: 8px 0;
  outline: none;
  padding: 8px;
  box-sizing: border-box;
  transition: 0.3s;
  display: inline-block;
}

input[type="text"]:focus {
  border-color: dodgerBlue;
  box-shadow: 0 0 8px 0 dodgerBlue;
}
</style>

<link rel="stylesheet" href="https://raw.githack.com/dimaslanjaka/Web-Manajemen/master/css/bootstrap-4.5-wrapper.css" />

<div id="bootstrap-wrapper">
  <div class="container">
    <label for="search-questions" class="sr-only">Filter</label>
    <input autocomplete="chrome-off" type="text" id="search-questions" class="form-control" placeholder="search from here">
    <small id="search-questionsHelpBlock" class="form-text text-muted">
      Last updated <!-- now() -->
    </small>

  </div>

  <ul id="questions">
    <!-- include /source/assets/tlon/Quiz/quiz.txt -->
  </ul>

  <blockquote>
    If you know of other questions and answers that are not on the list, please comment below.
  </blockquote>
</div>

<script>
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

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const quizUrl =
  "https://dimaslanjaka-cors.herokuapp.com/https://raw.githubusercontent.com/dimaslanjaka/dimaslanjaka.github.io/compiler/source/assets/tlon/Quiz/quiz.txt";
let quizSrc = [];

function jQueryMethod() {
  const processLi = function () {
    // ul questions
    const questions = document.getElementById("questions");
    const inputSearch = document.getElementById("search-questions");

    jQuery("#search-questions").keyup(function () {
      var filter = jQuery(this).val();
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
    });
  };

  // clean orphan text
  $("#questions").text('');
  // remove existing li's
  $("#questions li").remove();

  $.get(quizUrl).then(function (data) {
    if (data) {
      const split = data.split("\n");
      quizSrc = quizSrc.concat(split);
      quizSrc.map(function (str) {
        const li = document.createElement("li");
        li.innerHTML = str;
        document.getElementById("questions").appendChild(li);
      });
    }
    processLi();
  });
}

loadJScript(
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
  jQueryMethod
);
</script>
