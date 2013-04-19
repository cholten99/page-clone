// In the new tab load the HTML from the Needs Help guy (after convert from widgets to read only)
// Then start polling for updates from the Needs Help guy page
// On receiving an update, make the appropriate changes on the this (remote) tab

// Global variables - form and html data as fetched from the server along with timestamps
UserFormsData = "";
UserFormsDataTimestamp =0;
UserHTMLData = "";
UserHTMLDataTimestamp = 0;

function InitialPageLoadAndPoll(UserUID, HelperUID) {

  $.get('CreateConnection.php', { UserUID: UserUID, HelperUID: HelperUID }, function(data) {

    // Fill in the requesters html
    dataArray = jQuery.parseJSON(data);
    UserHTMLData = dataArray['UserHTML'];

    // TBD: Getting funny stuff with the HEAD section so stripping it out for now
    headPos = UserHTMLData.indexOf("</head>") + 7;
    UserHTMLData = UserHTMLData.substring(headPos);

    // Replace the current BODY contents with the remote tab contents
    $("#ChangeMe").html(UserHTMLData);    

    // TBD : Replicate the form contents
    UserFormsData = dataArray['UserFormData'];
    formDataArray = jQuery.parseJSON(UserFormsData);

    for(var index in formDataArray) {
      $("#" + index).values(formDataArray[index]);
    }

    // Set all the elements in all the forms to disabled
    $("form").each(function() {
      $("#" + this.name + " :input").attr("disabled", true);
    });

  });

  window.setTimeout("PollForChanges()", 3000);

}

function PollForChanges() {
  // TBD: Get both timestamps from server - if either is more recent than the global values get one (of both) of the data 
  // (suggest passing in "Timestamps", "Form", "HTML" or "Both" to a single script -- remember to update the global variables 
  // as well as the page HTML / form data after a fetch

  window.setTimeout("PollForChanges()", 1000);
}