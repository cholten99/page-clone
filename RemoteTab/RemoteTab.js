// Global variables
var MouseClickImage;
var MousePointerImage;
var UserUID;
var FirebaseRef;

// onLoad function
$(function() {

  // Get the UserUID
  var searchArray = window.location.search.split("=");
  UserUID = searchArray[1];

  // Set up mouse click animation
  MouseClickImage = new Image();
  MouseClickImage.src = "mouseAnim.gif";

  $('#mouseClickDiv').css({ 
    position: "absolute",
    marginLeft: 0, marginTop: 0,
    top: 50, left: 50
  }).appendTo('body'); 

  // Set up mouse pointer image
  MousePointerImage = new Image();
  MousePointerImage.src = "mousePointer.png";

  $('#mousePointerDiv').css({ 
    position: "absolute",
    marginLeft: 0, marginTop: 0,
    top: 50, left: 50
  }).appendTo('body');

  // Connect to Firebase
  FirebaseRef = new Firebase("https://blazing-fire-4598.firebaseio.com");

  // Initial page setup and page change event capture
  initialiseRef = FirebaseRef.child('queue').child(UserUID).child('initialise');
  initialiseRef.on('value', function(snapshot) {
    updateHTMLandFormBaseline(snapshot.val());
  });

  // Handle scroll events
  scrollRef = FirebaseRef.child('queue').child(UserUID).child('scroll');
  scrollRef.on('value', function(snapshot) {
    var value = snapshot.val();
    var yScroll = value.yScroll;
    $(window).scrollTop(yScroll);
  });

  // Handle mouse click events
  mouseClickRef = FirebaseRef.child('queue').child(UserUID).child('mouseClick');
  mouseClickRef.on('value', function(snapshot) {

    mouseLocRef = FirebaseRef.child('queue').child(UserUID).child('mouseLoc');
    mouseLocRef.once('value', function(snapshot) {
      var value = snapshot.val();
      var xValue = value.xMouse - 50;
      var yValue = value.yMouse - 50;
      $("#mouseClickDiv").css("top", yValue);
      $("#mouseClickDiv").css("left", xValue);
      $("#mouseClickImage").attr('src', MouseClickImage.src);
    });

  });

  // Handle keyboard events
  keyRef = FirebaseRef.child('queue').child(UserUID).child('key');
  keyRef.on('value', function(snapshot) {
    updateElement(snapshot.val());
  });

  // Handle element update events
  elementRef = FirebaseRef.child('queue').child(UserUID).child('element');
  elementRef.on('value', function(snapshot) {
    updateElement(snapshot.val());
  });

  // Handle mouse location events
  mouseLocRef = FirebaseRef.child('queue').child(UserUID).child('mouseLoc');
  mouseLocRef.on('value', function(snapshot) {
    var value = snapshot.val();
    var xValue = value.xMouse - 15;
    var yValue = value.yMouse;
    $("#mousePointerDiv").css("top", yValue);
    $("#mousePointerDiv").css("left", xValue);
    $("#mousePointerImage").attr('src', MousePointerImage.src);
  });

  // Handle tidying up the Firebase queue when this page is closed
  var disconnectRef = FirebaseRef.child('queue').child(UserUID);
  disconnectRef.onDisconnect().remove();

});

// Deal with when we get a new or changed pageload
function updateHTMLandFormBaseline(data) {

  // Get the HTML from Firebase
  var html = data.html;

  // Add in the CSS files
  var startPos = html.indexOf("href=");
  while (startPos != -1) { 
    var endPos = html.indexOf(">", startPos);
    var cssFile = html.substring(startPos + 6, endPos - 1);
    $("<link>").appendTo($('head')).attr({type : 'text/css', rel : 'stylesheet'}).attr('href', cssFile);
    startPos = html.indexOf("href=", endPos);
  }

  // Set up the HTML including the viewport wrapping DIV
  var startPos = html.indexOf("ExistingHelpSessionCheck") + 34;
  html = html.substring(startPos);
  var endPos = html.indexOf("</body>");
  html = html.substring(0, endPos);

  html = "<div id='viewportWrapperDiv'>\n" + html + "</div></body>";

  $("#ChangeMe").html(html);

  var height = data.viewport.viewportHeight;
  var width = data.viewport.viewportWidth;
  $("#viewportWrapperDiv").css("width", width);
  $("#viewportWrapperDiv").css("height", height);
  $("#viewportWrapperDiv").css("border-style", "solid");
  $("#viewportWrapperDiv").css("border-color", "red");

  // Fill in the form baseline
  var formDataArray = jQuery.parseJSON(data.formBaseline);
  var tempObject;

  for (var formID in formDataArray) {
    var elementArray = formDataArray[formID];

    for (var elementID in elementArray) {
      tempObject = new Object();
      tempObject[elementID] = elementArray[elementID];
      $("#" + formID).values(tempObject);
    }
  }

  // Update the shown UID to make sure we're seeing exactly the same as the user
  $("#HelpRequest").html("Your help session number is " + UserUID + ".");

  // Set all the elements in all the forms to disabled and set colour to red
  $("form").each(function() {
    $("#" + this.name + " :input").attr("disabled", true);
    $("#" + this.name + " :input").css('color', 'red');
  });
}

// Deal with changes in form elements or key presses
function updateElement(data) {
  var tempObject = new Object();
  var element = data.element;
  var value = data.value;

  // Time to introduce a terrible, hopefully temporary, hack...
  // This is because it only seems to register successfully for all parts of a set of radio buttons if their IDs are different
  // But... If there IDs are different the 'values' function doesn't then set them correctly...
  if (element.substr(element.length - 5) == "Radio") {
    for(var i = 0; i < element.length; i++) {
      if (element.charAt(i) == element.charAt(i).toUpperCase()) {
        element = element.substring(0, i);
        break;
      }
    }
  }

  tempObject[element] = value;
  $("#" + data.form).values(tempObject);

}

// Helper function from : http://goo.gl/ZFacl
$.fn.values = function(data) {
  var inps = $(this).find(":input").get();

  if(typeof data != "object") {
    // return all data
    data = {};

    $.each(inps, function() {
      if (this.name && (this.checked 
                        || /select|textarea/i.test(this.nodeName)
                        || /text|hidden|password/i.test(this.type))) {
        data[this.name] = $(this).val();
      }
    });
    return data;
  } else {
    $.each(inps, function() {

      // Next 3 lines my patch on the original code to cope with emptying text fields
      if ((this.type == "text" || this.type == "textarea") && this.name && (data[this.name] == "")) {
        $(this).val("");
      }

      if (this.name && data[this.name]) {
        if(this.type == "checkbox" || this.type == "radio") {
          $(this).prop("checked", (data[this.name] == $(this).val()));
        } else {
          $(this).val(data[this.name]);
        }
      } else if (this.type == "checkbox") {
        $(this).prop("checked", false);
      }
    });
    return $(this);
  }
};