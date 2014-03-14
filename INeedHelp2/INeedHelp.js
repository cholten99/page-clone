// Config values to update when using the service on a different page
var PageLocation = "INeedHelp2/index.html";
var CookieName = "WasteCarrierUserUID";

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

// Get cookie function
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

  var page = location.pathname.substring(1);

  // Little hack to remove the cookie if we're loading the first page
  // would need something better to be more generic
  if ((page == "index.html") || (page == PageLocation)) {
    SetCookie(CookieName, "", 1);
    return;
  }

  var userUID = GetCookie(CookieName);
  if (userUID != "") {
    SetUpSession(userUID);
  }
}

// Handle setting up (or updating) the connection to the help session
function SetUpSession(userUID) {
  // First load jQuery
  CheckLoadJSFile("//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js");

  // Then Firebase
  CheckLoadJSFile("//cdn.firebase.com/js/client/1.0.6/firebase.js");

  // Load the other JS we need - version numbers to get over irritating caching
  CheckLoadJSFile("//bowsy.me.uk/PageClone/INeedHelp/INeedHelpFull.js?v=15");

  // Irritatingly the imported JS isn't executable until this call stack is resolved
  // So, call the next function from a timer
  window.setTimeout("ConnectSession('" + userUID + "')", 500);
}
