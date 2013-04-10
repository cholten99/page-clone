
function makeConnection() {
  // Set up the event handlers for form objects (including key pressed), links and page scroll

/* 
   >>>>>>>>>>>>>>
   TBD RIGHT HERE 
   <<<<<<<<<<<<<<
*/

  // Set up first connection, need to send UID, full HTML and scroll position
  // Have to use POST as HTML likely to be over 1024 bytes
  // At some point will have to handle errors but nothing to do if successful

  var scrollTop = $(window).scrollTop();
  var windowHeight = $(window).height();
  var scrollPercent = (scrollTop / windowHeight) * 100;

  var html = $("html").html();

//  $.post("firstConnection.php", { UID: "DavidDurant", HTML: html, Scroll: scroll })

/* 
   >>>>>>>>>>>>>>
   TBD RIGHT HERE 
   <<<<<<<<<<<<<<
*/

}
