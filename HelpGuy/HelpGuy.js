// Global variable for the HelperUID
HelperUID = "";

// Login function - does nothing but update the UI and the global variable for now
function Login() {
  HelperUID = $("#HelperUID").val();
  var newText = "Logged in as " + HelperUID + ".";
  $("#Login").html(newText);
  PollSessionRequests();
}

// Poll every two seconds for updates
function PollSessionRequests() {

  $.get('../Common/CRUD.php', { Function: 'GetAllRowsForFields', UserUID: 0 }, function(data) {

    var nameListArray = jQuery.parseJSON(data);
    var numberOfUsersWaiting = nameListArray.length;

    $('#TopText').html("Number of open requests: " + numberOfUsersWaiting + "<p>");

    // Don't even show the queue if there's nothing to show
    if (numberOfUsersWaiting != 0) {

      $('#ListHeaders').html("<div id='ListHeader'>Session Keyword</div>");

      var htmlString = "";
      var odd = true;
      for (var i=0; i < numberOfUsersWaiting; i++) {
        var userUID = nameListArray[i]['UserUID'];

        var remoteTabURL = "http://bowsy.me.uk/PageClone/RemoteTab/index.php?UserUID=" + userUID;

        var divContents = "<div id='" + odd + "'><a target='_blank' href='" + remoteTabURL + "'>" + userUID + "</a></div>";

        htmlString += "<div id='ListRow'>" + divContents + "</div><p>";
        odd ? odd = false : odd = true;
      }
      $('#Users').html(htmlString);

    }

    // Loop around again every 2 seconds (forever) to set up another long-response AJAX call
    setTimeout("PollSessionRequests();", 2000)

  }); 

}
