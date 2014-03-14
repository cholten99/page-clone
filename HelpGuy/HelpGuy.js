// Global variable for Firebase access, the HelperUID and vars to hold list of current open calls
FirebaseRef = null;
HelperUID = "";
numberCurrentCalls = 0;
currentCallsCounter = 0;
currentCallIDs = new Array();

// Login function
function Login() {
  HelperUID = $("#HelperUID").val();
  var newText = "Logged in as " + HelperUID + ".";
  $("#Login").html(newText);

  // Connect to Firebase
  FirebaseRef = new Firebase("https://blazing-fire-4598.firebaseio.com/PageClone");
  listRef = FirebaseRef.child('index');

  // Register for changes on the call counter
  currentCallsRef = FirebaseRef.child('currentCalls');
  currentCallsRef.on('value', function(snapshot) {

    numberCurrentCalls = snapshot.val();

    listRef.on('child_added', function(snapshot) {
      currentCallIDs.push(snapshot.val());
      currentCallsCounter++;

      if (currentCallsCounter == numberCurrentCalls) {
        $('#TopText').html("Number of open requests: " + numberCurrentCalls + "<p>");
        $('#ListHeaders').html("<div id='ListHeader'>Session UID</div>");

        var htmlString = "";
        var odd = true;
        for (var i=0; i < numberCurrentCalls; i++) {
          var userUID = currentCallIDs[i];
          var remoteTabURL = "http://bowsy.me.uk/PageClone/RemoteTab/index.html?UserUID=" + userUID;
          var divContents = "<div id='" + odd + "'><a target='_blank' href='" + remoteTabURL;
          divContents = divContents + "' onclick='updateHelpGuy(" + userUID + "); return true;'>" + userUID + "</a></div>";
          htmlString += "<div id='ListRow'>" + divContents + "</div><p>";
          odd ? odd = false : odd = true;
        }
        $('#Users').html(htmlString);

        listRef.off();
        currentCallsCounter = 0;
        currentCallIDs = new Array();
      }

    });

  });

}

// Inform the help requestor who their support person is and tidy the calls list
function updateHelpGuy(userUID) {
  // Update the name of the assistant on the calling page
  FirebaseRef.child('queue').child(userUID).update({assistant: HelperUID});

  // Remove the call from the index - we'll remove it from the main queue when the remote window closes
  removeRef = FirebaseRef.child('index').child(userUID);
  removeRef.remove();

  // Finally decrease the currentCalls counter
  var currentCallRef = FirebaseRef.child('currentCalls');
  currentCallsRef.transaction(function(current_value) {
    return current_value - 1;
  });
}
