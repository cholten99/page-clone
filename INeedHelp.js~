
function loadJS(filename) {
  var fileref=document.createElement('script');
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", filename);
  document.getElementsByTagName("head")[0].appendChild(fileref);
}

function doIt() {
  // First load jQuery
  loadJS("//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js");

  // Then load any other JS we need
  loadJS("//bowsy.me.uk/PageClone/INeedHelpFull.js");

  // Irritatingly the imported JS isn't executable until this call stack is resolved
  // So, call the next function from a timer
  window.setTimeout("doIt2()", 500);
}

function doIt2() {
  // Call the function in the main library to do the actual work
  makeConnection();
}
