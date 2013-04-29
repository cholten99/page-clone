// Global variable for form(s) contents 
FormsData = "";

// Global variable for this users UID 
UserUID = "";

function GetFormsData() {
  formsArray = {};
  $("form").each(function() {
    formsArray[this.name] = $("#" + this.name).values();
  });
  formsJSON = JSON.stringify(formsArray, null, 2);
  return(formsJSON);
}

function CheckForFormsChange() {
  var formsJSON = GetFormsData();
  if (formsJSON != FormsData) {
    FormsData = formsJSON;
    var date = new Date();
    var timestamp = date.getTime() / 1000;
    $.post("../Common/CRUD.php", { Function: "UpdateRow", UserUID : UserUID, UserFormData: formsJSON, UserFormDataTimestamp: timestamp }, function(data) {});
  }
  window.setTimeout("CheckForFormsChange()", 1000);
}

function ConnectSession(userUID) {
  var html = $("html").html();
  var formsJSON = GetFormsData();

  // Save the forms value in the global variable
  FormsData = formsJSON;

  // Let's check if it's the first time we're doing this
  if (userUID == "NewCall") {

    // We're creating a new session, so first set userUID to a new random keyword
    $.get("RandomWord.php", function(data) {
      UserUID = data.charAt(0).toUpperCase() + data.slice(1);

      // Update what is shown to the help requesting user
      $("#HelpRequest").html("Your help session keyword is " + UserUID);

      // We need the current timestamp to add to the DB
      var date = new Date();
      var secondsSinceEpoch = date.getTime() / 1000;

      // Then add a row in the DB for the call
      $.post("../Common/CRUD.php", { Function: "AddRow", UserUID: UserUID, UserHTML: html, UserHTMLTimestamp: secondsSinceEpoch, UserFormData: formsJSON, UserFormDataTimestamp: secondsSinceEpoch }, function(data) {});

      // Finally, set the cookie so page-shifting works
      SetCookie("UserUID", UserUID, 1);

    });

  } else {
    // Set the global variable
    UserUID = userUID;

    // We need the current timestamp to add to the DB
    var date = new Date();
    var secondsSinceEpoch = date.getTime() / 1000;

    // userUID has been set from the cookie (we've been called from ExistingHelpSessionCheck) so update existing DB row
    $.post('../Common/CRUD.php', { Function: "UpdateRow", UserUID: UserUID, UserHTML: html, UserHTMLTimestamp: secondsSinceEpoch, UserFormData: formsJSON }, function(data){} );

    // Update what is shown to the help requesting user
    $("#HelpRequest").html("Your help session keyword is " + UserUID);
  }

  // Simple polling check every second to see if the form data has changed, send to server if it has
  window.setTimeout("CheckForFormsChange()", 3000);

}