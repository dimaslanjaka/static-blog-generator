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

#incoming-terms * {
  font-size: 10px;
  margin: 0;
}
</style>

<link rel="stylesheet" href="https://raw.githack.com/dimaslanjaka/Web-Manajemen/master/css/bootstrap-4.5-wrapper.css" />

<div id="bootstrap-wrapper">
  <div class="mb-2">
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

  <form action="https://backend.webmanajemen.com/tlon/quiz.php" method="post" id="addQuiz" target="_blank" name="form_add_quiz">
    <input type="hidden" name="add" value="add">
    <div class="row">
      <div class="col-md-6">
        <label for="newQ">Add new question</label>
        <textarea type="text" id="newQ" placeholder="add new question" name="q" class="form-control"></textarea>
      </div>
      <div class="col-md-4">
        <div class="mb-2">
          Answer of new question (pick one)
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="customRadioInline1" name="a" name="q" class="custom-control-input" value="O">
          <label class="custom-control-label" for="customRadioInline1">(O)</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input type="radio" id="customRadioInline2" name="a" class="custom-control-input" value="X">
          <label class="custom-control-label" for="customRadioInline2">(X)</label>
        </div>
        <div id="submitter" class="mt-2">
          <button type="submit" class="btn btn-primary btn-block btn-sm">Send</button>
        </div>
      </div>
    </div>
  </form>

  <blockquote class="mt-2">
    Join discord https://tiny.one/INDO1945.<br />
    This article shortcut url https://bit.ly/TLONQUIZ<br />
    Add new quiz https://bit.ly/TLONQUIZADD<br />
    Code this article https://codepen.io/dimaslanjaka/pen/yLbrZVo<br />
    This article https://git.webmanajemen.com/The%20Legend%20Of%20Neverland/Quiz.html
  </blockquote>

  <div id="incoming-terms">
    <ul>
      <li>quiz the legend of neverland</li>
      <li>jawaban quiz the legend of neverland</li>
      <li>quiz grid the legend of neverland</li>
      <li>quiz clue the legend of neverland</li>
      <li>quiz the legend of neverland updated</li>
    </ul>
  </div>
</div>

<!-- script /source/assets/js/quiz.js -->
