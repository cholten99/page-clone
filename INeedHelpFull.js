
// Global variable for whether (and who) is assisting
HelperUID = "";

// Function to poll to show help requester the state of the call
function PollForHelper(UID, FirstTime) {

  // Query the server for the status of the call
  poll = false;
  html = "";

  $.get('PollForHelper.php', { UID: UID }, function(data) {
    if ((data == 'Unasigned') || (FirstTime == true)) {
      html = "<font color='red'>Request for help sent!</font>";
      poll = true;
    } else if (data == '') {
      html = "<button type='button' onclick='MakeConnection()'>Request Help</button>";
      HelperUID = "";
      poll = false;
    } else {
      html = "<font color='red'>Connected to " + data + "</font>";
      HelperUID = data;
      poll = true;
    }
    $("#HelpRequest").html(html);

    if (poll == true) {
      window.setTimeout("PollForHelper('" + UID + "', false)", 5000);
    }
  });

}

function MakeConnection() {
  // TBD: Set up the event handlers for form objects (including key pressed) and handle links

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

  // Set up first connection, need to send UID, full HTML and form contents
  // Have to use POST as HTML likely to be over 1024 bytes
  UID = $("#aForm").find("#UID").val();
  HTML = $("html").html();

  formsArray = {};
  $("form").each(function() {
    formsArray[this.name] = $("#" + this.name).values();
  });
  formsJSON = JSON.stringify(formsArray, null, 2);

  // Send the data off to the server
  $.post("INeedHelp.php", { UID: UID, HTML: HTML, UserFormData: formsJSON });

  // Update the requesting page
  PollForHelper(UID, true);
}

function sendEvent() {
  // TBD : Send captured events to the server - including UID
  
}