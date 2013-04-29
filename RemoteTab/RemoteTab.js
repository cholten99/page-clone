function UpdateFormContents(userUID) {
  $.get('../Common/CRUD.php', { Function: 'GetFieldsForRow', UserUID: userUID, UserFormData: 0 }, function(data) {
    var dataArray = jQuery.parseJSON(data);
    var userFormsData = dataArray['UserFormData'];
    var formDataArray = jQuery.parseJSON(userFormsData);
    for(var index in formDataArray) {
      $("#" + index).values(formDataArray[index]);
    }
  });
}

function PollForChanges(userUID, userHTMLTimestamp, userFormDataTimestamp) {

  // Get the two timestamps
  $.get('../Common/CRUD.php', { Function: 'GetFieldsForRow', UserUID : userUID, UserHTMLTimestamp : 0, UserFormDataTimestamp: 0 }, function(data) {

    var timestampArray = jQuery.parseJSON(data);

    // If the HTML timestamp is later update both
    if (timestampArray['UserHTMLTimestamp'] > userHTMLTimestamp) {
      userHTMLTimestamp = timestampArray['UserHTMLTimestamp'];
      userFormDataTimestamp = timestampArray['UserFormDataTimestamp'];

      $.get('../Common/CRUD.php', { Function: 'GetFieldsForRow', UserUID: userUID, UserHTML: 0 }, function(data) {
        var dataArray = jQuery.parseJSON(data);
        var userHTML = dataArray['UserHTML'];

        // Getting funny stuff with the HEAD section so stripping it out for now
        var headPos = userHTML.indexOf("</head>") + 7;
        userHTML = userHTML.substring(headPos);

        // Also stripping out the request for help bit at the bottom
        var linePos = userHTML.indexOf("<hr");
        userHTML = userHTML.substring(0, linePos - 1);

        $("#ChangeMe").html(userHTML);
        UpdateFormContents(userUID);

        // Set all the elements in all the forms to disabled and set colour to red
        $("form").each(function() {
          $("#" + this.name + " :input").attr("disabled", true);
          $("#" + this.name + " :input").css('color', 'red');
        });

      });

    } else if (timestampArray['UserFormDataTimestamp'] > userFormDataTimestamp) {
      userFormDataTimestamp = timestampArray['UserFormDataTimestamp'];
      UpdateFormContents(userUID);
    }

    window.setTimeout("PollForChanges('" + userUID  + "'," + userHTMLTimestamp + "," + userFormDataTimestamp + ")", 1000);
  });

}