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
      poll = false;
    } else {
      html = "<font color='red'>Connected to " + data + "</font>";
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


  // Set up first connection, need to send UID, full HTML and form contents
  // Have to use POST as HTML likely to be over 1024 bytes
  UID = $("#aForm").find("#UID").val();
  HTML = $("html").html();

  formsArray = [];
  elementsArray = [];
  $("form").each(function() {
    var elementsList = $("#" + this.name).prop("elements");
    for (var i = 0, len = elementsList.length; i < len; i++) {
      elementsArray[elementsList[i].name] = elementsList[i].value;
    }
    formsArray[this.name] = elementsArray;
    elementsArray.length = 0;
  });
  formsJSON = JSON.stringify(formsArray);

console.log(formsJSON);

  // Send the data off to the server
  $.post("INeedHelp.php", { UID: UID, HTML: HTML });

  // Update the requesting page
  PollForHelper(UID, true);
}

function sendEvent() {
  // TBD : Send captured events to the server - including UID
  
}