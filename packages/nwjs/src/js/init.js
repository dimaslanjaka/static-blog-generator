const os = require("os");

(function ($) {
  $(function () {
    $(".sidenav").sidenav();
  }); // end of document ready

  document.querySelector("#os").innerHTML = os.platform().toUpperCase();
})(jQuery); // end of jQuery name space
