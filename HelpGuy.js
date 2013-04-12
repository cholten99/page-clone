
// This JS file is used by the Help Guy original page and the new tab it opens

// Start by polling to see if Needs Help person wants help - poll ever 2 seconds?
// If they do want help, open a new tab - load HelpGuyTab.html

function PollUsers() {
  $.get('phpFuncs.php', { funcNumber: 2 }, function(data) {
    nameListArray = jQuery.parseJSON(data);
    htmlString = "";
    for (var i=0; i < nameListArray.length; i++) {
      url = "<a target='_blank' href=\"http://bowsy.me.uk/PageClone/remote.php?UID=" + nameListArray[i] + "\">" + nameListArray[i] + "</a>";
      htmlString += url + "<p>";
    }
    $('#Users').html(htmlString);
  });
  
  // Poll to check for new users asking for help
  window.setTimeout("PollUsers()", 2000);
}

// In the new tab load the HTML from the Needs Help guy (after convert from widgets to read only)
// Then start polling for updates from the Needs Help guy page (how often?)
// On receiving an update, make the appropriate changes on the remote tab

function InitialPageLoadAndPoll(UID) {
  $.get('phpFuncs.php', { funcNumber: 3, UID: UID }, function(data) {
    combinedData = jQuery.parseJSON(data);
    html = combinedData['HTML'];
    scroll = combinedData['Scroll'];

    // Fill in the requestors html
    $("html").html(html);
    
    // Set to their scroll position (works in percents to remove resolution issues)
    var windowHeight = $(window).height();
    var percent = scroll / 100;
    var heightPixels = Math.round(windowHeight * percent);
console.log(heightPixels);
//    $('html,body').animate({scrollTop: windowHeight - heightPixels}, 1000);
    $('html,body').animate({scrollTop: 200}, 1000);
  });
}