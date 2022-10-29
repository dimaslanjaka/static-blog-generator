/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


//mengganti bahasa form
function changeIdLanguage() {
    $("#content").load("language/myrewriter_indonesia.html");
    //document.getElementById("content").innerHTML = "language/myrewriter_indonesia.html";
}
function changeEnLanguage() {
    $("#content").load("language/myrewriter_english.html");
}
function changeJpLanguage() {
    $("#content").load("language/myrewriter_japan.html");
}