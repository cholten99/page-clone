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

// Cookie code more-or-less cribbed from : http://www.w3schools.com/js/js_cookies.asp
function SetCookie(cookieName, value, days) {
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + days);
  var cookieValue = escape(value) + ((days==null) ? "" : "; expires=" + expireDate.toUTCString() + "; path=/");
  document.cookie = cookieName + "=" + cookieValue;
}

// Get cookie function - needed in this JS to check is we are already in a session
function GetCookie(cookieName) {
  var allCookies = document.cookie;

  // Check if it's in the list but not the first
  var start = allCookies.indexOf(" " + cookieName + "=");

  if (start == -1) {
    // Check if it's the first
    start = allCookies.indexOf(cookieName + "=");
  }

  var value = null;
  // If we've still not found it it's not in there
  if (start != -1) {
    start = allCookies.indexOf("=", start) + 1;
    var end = allCookies.indexOf(";", start);

    if (end == -1) {
      end = allCookies.length;
    }

    value = unescape(allCookies.substring(start, end));
  }

  return value;
}

// Check to see if we're already in a help session
function ExistingHelpSessionCheck() {

  // Little hack to remove the cookie if we're loading the first page
  if (document.URL == "http://bowsy.me.uk/PageClone/INeedHelp/") {
    SetCookie("UserUID", "", 1);
    return;
  }

  var userUID = GetCookie("UserUID");
  if (userUID != "") {
    DoIt(userUID);
  }
}

// Handle setting up (or updating) the connection to the help session
function DoIt(userUID) {
  // First load jQuery
  CheckLoadJSFile("//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js");

  // Load the other JS we need
  CheckLoadJSFile("//bowsy.me.uk/PageClone/Common/Utils.js?v=4");
  CheckLoadJSFile("//bowsy.me.uk/PageClone/INeedHelp/INeedHelpFull.js?v=4");

  // Irritatingly the imported JS isn't executable until this call stack is resolved
  // So, call the next function from a timer
  window.setTimeout("ConnectSession('" + userUID + "')", 500);
}