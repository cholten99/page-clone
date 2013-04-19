// Global variable for whether (and who) is assisting
HelperUID = "";

// Global variable for form(s) contents
FormsData = "";

// Global variable for polling (used for both polling the server for job connection status and polling the forms
// to see if we need to update the server
Poll = false;

// Function to poll to show help requester the state of the call
function PollForHelper(UID, FirstTime) {

  // Query the server for the status of the call
  html = "";

  $.get('PollForHelper.php', { UID: UID }, function(data) {
    if ((data == 'Unasigned') || (FirstTime == true)) {
      html = "<font color='red'>Request for help sent!</font>";
      Poll = true;
    } else if (data == '') {
      html = "<button type='button' onclick='MakeConnection()'>Request Help</button>";
      HelperUID = "";
      Poll = false;
    } else {
      html = "<font color='red'>Connected to " + data + "</font>";
      HelperUID = data;
      Poll = true;
    }
    $("#HelpRequest").html(html);

    if (Poll == true) {
      window.setTimeout("PollForHelper('" + UID + "', false)", 5000);
    }
  });

}

function GetFormsData() {
  formsArray = {};
  $("form").each(function() {
    formsArray[this.name] = $("#" + this.name).values();
  });
  formsJSON = JSON.stringify(formsArray, null, 2);
  return(formsJSON);
}

function MakeConnection() {
  // TBD: Handle moving between pages

/*
  // Add click handlers to all of the links
  $("a").each(function() {
    $("#" + this.id).click(function() {
      event.preventDefault();
      newUrl = this.href;
      if ((this.href).indexOf("?") == -1) {
        newUrl += "?";
      } else {
        newUrl += "&";
      }
      newUrl += "HelperUID=" + HelperUID;
      window.location.href = newUrl;
    });
  });
*/

  // Set up first connection, need to send UID, full HTML and form contents
  // Have to use POST as HTML likely to be over 1024 bytes
  var UID = $("#aForm").find("#UID").val();
  var HTML = $("html").html();
  var formsJSON = GetFormsData();

  // Save the initial value in the global variable
  FormsData = formsJSON;

  // Send the data off to the server
  $.post("INeedHelp.php", { UID: UID, HTML: HTML, UserFormData: formsJSON });

  // Simple polling check every second to see if the form data has changed, send to server if it has
  window.setTimeout("CheckForFormsChange()", 3000);

  // Start polling for connection
  PollForHelper(UID, true);
}

function CheckForFormsChange() {
  var formsJSON = GetFormsData();
  if (formsJSON != FormsData) {
    var UID = $("#aForm").find("#UID").val();
    FormsData = formsJSON;
    $.post("UpdateFormData.php", { UserUID: UID, UserFormData: formsJSON });
  }
  if (Poll == true) {
    window.setTimeout("CheckForFormsChange()", 1000);
  }

}