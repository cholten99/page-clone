
function MakeConnection() {
  // TBD: Set up the event handlers for form objects (including key pressed) and handle links


  // Set up first connection, need to send UID and full HTML
  // Have to use POST as HTML likely to be over 1024 bytes
  var uid = $("#aForm").find("#UID").val();
  var html = $("html").html();

  $.post("INeedHelp.php", { UID: uid, HTML: html });
}

function sendEvent() {
  // TBD : Send captured events to the server - including UID
  
}