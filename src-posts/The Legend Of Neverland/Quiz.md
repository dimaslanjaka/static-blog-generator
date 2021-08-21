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
    <div class="mt-1 mb-1">
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" id="O_only" value="option1">
        <label class="form-check-label" for="O_only">Only Show (O)</label>
      </div>
    </div>
    <small id="search-questionsHelpBlock" class="form-text text-muted">
      Last updated
      <!-- now() -->
    </small>

  </div>

  <ul id="questions">
    <!-- include /source/assets/tlon/Quiz/quiz.txt -->
  </ul>

  <blockquote>
    If you know of other questions and answers that are not on the list, please comment below or join [Discord INDO1945](https://tiny.one/INDO1945)
  </blockquote>
</div>

<!-- script /source/assets/js/quiz.js -->
