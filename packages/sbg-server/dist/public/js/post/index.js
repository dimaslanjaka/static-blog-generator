(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var searchbox = document.querySelector('#search-dropdown');
searchbox.addEventListener('input', changeHandler);
searchbox.addEventListener('change', changeHandler);
function changeHandler(e) {
  e.preventDefault();
  /**
   * @type {HTMLInputElement}
   */
  var target = e.target;
  var value = target.value;
  var posts = Array.from(document.querySelectorAll('[aria-find="post"]'));
  for (var i = 0; i < posts.length; i++) {
    var post = posts[i];
    // hide non-matches post title
    if (!post.querySelector('[aria-find="title"]').textContent.includes(value)) {
      post.classList.add('hidden');
    }
    // remove hidden when value is empty
    if (value.length === 0 && post.classList.contains('hidden')) {
      post.classList.remove('hidden');
    }
  }
}

},{}]},{},[1]);
