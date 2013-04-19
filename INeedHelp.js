// Load javascript on the fly
var filesadded="" //list of JS files already added

function LoadJS(filename) {
  var fileref=document.createElement('script');
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", filename);
  document.getElementsByTagName("head")[0].appendChild(fileref);
}

function CheckLoadJSFile(filename){
 if (filesadded.indexOf("["+filename+"]")==-1) {
  LoadJS(filename)
  filesadded+="["+filename+"]"
 }
 else
  console.log("Javascript file " + filename + " already added!")
}

function DoIt() {
  // First load jQuery
  CheckLoadJSFile("//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js");

  // Load the Utils library
  CheckLoadJSFile("//bowsy.me.uk/PageClone/Utils.js");

  // Load any other JS we need
  CheckLoadJSFile("//bowsy.me.uk/PageClone/INeedHelpFull.js?v=2");

  // Irritatingly the imported JS isn't executable until this call stack is resolved
  // So, call the next function from a timer
  window.setTimeout("DoIt2()", 500);
}

function DoIt2() {
  // Call the function in the main library to do the actual work
  MakeConnection();
}