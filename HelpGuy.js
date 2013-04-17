// This JS file is used by the Help Guy original page and the new tab it opens

// Start by polling to see if Needs Help person wants help - poll ever 2 seconds?
// If they do want help, open a new tab - load HelpGuyTab.html

function EndCall(UID) {
  $.get('EndCall.php', { UID: UID }, function() {});
}

function PollUsers() {
  $.get('PollUserList.php', function(data) {
    nameListArray = jQuery.parseJSON(data);
    htmlString = "";
    for (var i=0; i < nameListArray.length; i++) {
      url = "<a target='_blank' href=\"http://bowsy.me.uk/PageClone/RemoteTab.php?UID=" + nameListArray[i] + "&HelperUID=" + $("#HelperUID").val() + "\">" + nameListArray[i] + "</a> : <a href=\"javascript:void(0);\" onclick=\"EndCall('" + nameListArray[i] + "')\">End Call<\a>";
      htmlString += url + "<p>";
    }
    $('#Users').html(htmlString);
  });
  
  // Poll to check for new users asking for help
  window.setTimeout("PollUsers()", 2000);
}