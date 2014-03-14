// Global variable for Firebase access, users UID and assistant
FirebaseRef = null;
UserUID = "";
Assistant = "pending";

function ConnectSession(userUID) {
  // Connect to Firebase
  FirebaseRef = new Firebase("https://blazing-fire-4598.firebaseio.com/PageClone/");

  // Let's check if it's the first time we're doing this
  if (userUID == "NewCall") {

    // Get the next call index number
    var callMaxRef = FirebaseRef.child('callMax');
    callMaxRef.transaction(function(current_value) {
      return current_value + 1;
    }, function(error, committed, snapshot) {
      var callMax = snapshot.val();

      // Set the cookie so page-shifting works -- NB! CookieName is a global variable set in INeedHelp.js
      SetCookie(CookieName, callMax, 1);

      // Set the global variable
      UserUID = callMax;

      // Add it to the data queue -- NB normally you'd use Firebase push() here
      // but because we know that the call index ID is unique as it was generated 
      // inside the transaction we're currently still inside of...
      var queueRef = FirebaseRef.child('queue');
      queueRef.child(UserUID).set({assistant: 'pending'});

      // *sigh* - in order to make the event system work properly we're going to add some dummy elements
      FirebaseRef.child('queue').child(UserUID).child('scroll').update({update: "Updated"});
      FirebaseRef.child('queue').child(UserUID).child('mouseLoc').update({update: "Updated"});
      FirebaseRef.child('queue').child(UserUID).child('key').update({update: "Updated"});
      FirebaseRef.child('queue').child(UserUID).child('mouseClick').update({update: "Updated"});
      FirebaseRef.child('queue').child(UserUID).child('element').update({update: "Updated"});

      // Add it to the index list so the help assistant can get a list of pending UIDs
      // without having to pull a large amount of data for each one
      var indexRef = FirebaseRef.child('index');
      indexRef.child(UserUID).set(UserUID);

      // Finally update the current number of pending calls
      var currentCallsRef = FirebaseRef.child('currentCalls');
      currentCallsRef.transaction(function(current_value) {
        return current_value + 1;
      });

      // On to part two
      ConnectSessionPartTwo();    
    });

  } else {
    // We're in a addition page for a transaction so set the global variable to the value passed in from the cookie
    UserUID = userUID;
    ConnectSessionPartTwo();
  }
}

function ConnectSessionPartTwo() {

  // Kick off event registry for assistant name
  assistantNameRef = FirebaseRef.child('queue').child(UserUID).child('assistant');
  assistantNameRef.on('value', function(snapshot) {
    Assistant = snapshot.val();
    $("#HelpRequest").html("Your help session number is " + UserUID + ". Your assistant is " + Assistant + ".");
  });

  // Add the initial page conditions to Firebase
  var html = $("html").html();

  formsArray = {};
  $("form").each(function() {
    formsArray[this.name] = $("#" + this.name).values();
  });
  formBaseline = JSON.stringify(formsArray, null, 2);

  FirebaseRef.child('queue').child(UserUID).child('initialise').update({html: html, formBaseline: formBaseline});

  // Store the size of the users viewport
  var viewportWidth = $(document).width();
  var viewportHeight = $(document).height();
  FirebaseRef.child('queue').child(UserUID).child('initialise').child('viewport').set({viewportWidth: viewportWidth, viewportHeight: viewportHeight});

  // Register for mouse movement!
  $(document).mousemove(function(e){
    FirebaseRef.child('queue').child(UserUID).child('mouseLoc').update({xMouse: e.pageX, yMouse: e.pageY});
  });

  // Register for mouse click - to avoid caching am changing value to seconds since epoc
  $(document).mouseup(function(e){
    var seconds = Math.round(new Date() / 1000);
    FirebaseRef.child('queue').child(UserUID).child('mouseClick').update({update: seconds});
  });

  // Register for typing events
  $("form :input").each(function(){
    $("#" + this.id).keyup(function(e){
      var elementId = this.id;
      var form = $("#" + elementId).closest("form").attr("id");
      var value = $("#" + elementId).val();
      FirebaseRef.child('queue').child(UserUID).child('key').update({form: form, element: elementId, value: value});
    })
  });

  // Register for change events on form elements
  $("form :input").each(function(){
    $("#" + this.id).change(function(e){
      var elementId = this.id;
      var form = $("#" + elementId).closest("form").attr("id");
      var value = $("#" + elementId).val();
      FirebaseRef.child('queue').child(UserUID).child('element').update({form: form, element: elementId, value: value});
    })
  });

  // Register for scrolling
  $(window).scroll(function(){
    var scrollPos = $(window).scrollTop();
    FirebaseRef.child('queue').child(UserUID).child('scroll').update({yScroll: scrollPos});
  });

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
