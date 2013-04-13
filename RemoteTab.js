
// In the new tab load the HTML from the Needs Help guy (after convert from widgets to read only)
// Then start polling for updates from the Needs Help guy page (how often?)
// On receiving an update, make the appropriate changes on the remote tab

function InitialPageLoadAndPoll(UserUID) {

  $.get('GetRemotePage.php', { UserUID: UserUID }, function(data) {

    // Fill in the requesters html
    dataArray = jQuery.parseJSON(data);
    html = dataArray['UserHTML'];

    // TBD: Getting funny stuff with the HEAD section so stripping it out for now
    headPos = html.indexOf("</head>") + 7;
    html = html.substring(headPos);

    // Replace the current BODY contents with the remote tab contents
    $("html").html(html);    

// $("#aForm").find("#UID").val("Stuff");
// $("aForm :input").attr("disabled", true);

/*
    // Set all form widgets to disables
    $("form").each(function() {
      $(this.name + " :input").attr("disabled", true);
console.log(this.name);
    });
*/
  });

}
