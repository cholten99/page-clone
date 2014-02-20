// Global variable for key-up timer and scroll timer
keyUpTimer = null;
scrollTimer = null;

// Global variable for this users UID 
UserUID = "";

function ConnectSession(userUID) {
  // Get the current page's HTML
  var html = $("html").html();

  // Get the current page's form contents for a baseline
  formsArray = {};
  $("form").each(function() {
    formsArray[this.name] = $("#" + this.name).values();
  });
  formBaseline = JSON.stringify(formsArray, null, 2);

  // We need the current timestamp to add to the DB
  var date = new Date();
  var secondsSinceEpoch = date.getTime() / 1000;

  // Let's check if it's the first time we're doing this
  if (userUID == "NewCall") {

    // We're creating a new session, so first set userUID to a new random keyword
    // We have to do this via the back end as we're blocked from doing it directly here due to XSS blocks
    $.get("RandomWord.php", function(data) {
      UserUID = data.charAt(0).toUpperCase() + data.slice(1);

      // Set the cookie so page-shifting works
      SetCookie("UserUID", UserUID, 1);

    ConnectSessionPartTwo(html, formBaseline, secondsSinceEpoch);
    });

  } else {
    // Set the global variable to the value passed in from the cookie
    UserUID = userUID;

    ConnectSessionPartTwo(html, formBaseline, secondsSinceEpoch);
  }
}

function ConnectSessionPartTwo(html, formBaseline, secondsSinceEpoch) {

  // Update what is shown to the help requesting user
  $("#HelpRequest").html("Your help session keyword is " + UserUID);

  // Then add a row in the DB for the call
  $.post("../Common/CRUD.php", { Function: "AddRow", Table: "InitialisePage", UserUID: UserUID, HTML: html, FormBaseline: formBaseline, timestamp: secondsSinceEpoch }, function(data) {});

  // Register for mouse events
  // TO DO! There's a set of significant problems here. In Chrome, when clicking on a dropbox the mouse y-location
  // provided by the event is just wrong! Firefox doesn't fire mouse events at all sometimes!

  $(document).mouseup(function(e){

    var xPercent = Math.round((e.pageX / screen.width) * 100);
    var yPercent = Math.round((e.pageY / screen.height) * 100);
    var date = new Date();
    var timestamp = Math.round(date.getTime() / 1000);
    $.post("../Common/CRUD.php", { Function: "AddRow", Table: "Mouse", UserUID: UserUID, Timestamp: timestamp, xPercent: xPercent, yPercent: yPercent }, function(data) {});
  });

  // Register for typing events -- putting in a debounce to make sure it catches everything
  $(document).keyup(function(){
    window.clearTimeout(keyUpTimer);
    keyUpTimer = setTimeout("KeyUpSend()", 1000);
  });

  // Register for change events on widgets
  $("form :input").each(function(){
    $("#" + this.id).change(function(e){
      var elementId = this.id;
      var form = $("#" + elementId).closest("form").attr("id");
      var value = $("#" + elementId).val();
      UpdateServerForm(form, elementId, value);
    })  
  });

  // Register for scrolling -- putting in a debounce to make sure it catches everything
  $(window).scroll(function(){
    window.clearTimeout(scrollTimer);
    scrollTimer = setTimeout("ScrollSend()", 1000);
  });

}

function KeyUpSend() {
  var elementId = document.activeElement.id;
  var form = $("#" + elementId).closest("form").attr("id");
  var value = $("#" + elementId).val();
  UpdateServerForm(form, elementId, value);
}

function ScrollSend() {
  var scrollPos = $(window).scrollTop();
  var scrollPercent = Math.round((scrollPos / screen.height) * 100);
  var date = new Date();
  var timestamp = Math.round(date.getTime() / 1000);
  $.post("../Common/CRUD.php", { Function: "AddRow", Table: "Scroll", UserUID: UserUID, Timestamp: timestamp, yPercent: scrollPercent }, function(data) {});
}

function UpdateServerForm(form, element, value) {
    var date = new Date();
    var timestamp = Math.round(date.getTime() / 1000);
    $.post("../Common/CRUD.php", { Function: "AddRow", Table: "UpdatePage", UserUID: UserUID, Timestamp: timestamp, Form: form, Element: element, Value: value }, function(data) {});
}