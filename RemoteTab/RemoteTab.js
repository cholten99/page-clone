// Global for mouse animation image
var MouseImage;

// onLoad function
$(function() {

  // Setting up mouse click animation
  MouseImage = new Image();
  MouseImage.src = "mouseAnim.gif";

  $('#mousething').css({ 
    position: "absolute",
    marginLeft: 0, marginTop: 0,
    top: 50, left: 50
  }).appendTo('body'); 

});

function PollForChanges(userUID) {
  $.get('GetData.php', { UserUID : userUID }, function(data) {

    if (data != "Null") {
      var dataArray = jQuery.parseJSON(data);
      for (var index = 0; index < dataArray.length; ++index) {
        var dataType = dataArray[index]['Type'];

/************

TBD:
 * Firebase this
 * Tidy the code
 * Write business plan
   * Review code wrt speed, etc updates and security
   * Talk to IDA people wrt integration
   * Try iFrame via proxy for same thing for any web site
   * WebSockets (check via feature detection, not browser detection - same for WebRTC)
   * WebRTC for both desktop sharing and video conferencing (how to check bandwidth : http://goo.gl/5dN73X?)?
     * Also see : http://goo.gl/BGjG4Z
 * Get AD and User Experience testimonials
 * Book a meeting with David Wilks

*************/

        if (dataType == "InitialisePage") {

          // Add in the CSS files
          var html = dataArray[index]['HTML'];
          var startPos = html.indexOf("href=");

          while (startPos != -1) { 
            var endPos = html.indexOf(">", startPos);
            var cssFile = html.substring(startPos + 6, endPos - 1);
            $("<link>").appendTo($('head')).attr({type : 'text/css', rel : 'stylesheet'}).attr('href', cssFile);
            startPos = html.indexOf("href=", endPos);
          }

          // Display the HTML
          var startPos = html.indexOf("ExistingHelpSessionCheck") + 37;
          html = html.substring(startPos);
          var endPos = html.indexOf("</body>") + 7;
          html = html.substring(0, endPos);
          $("#ChangeMe").html(html);

          // File in the form baseline
          var formDataArray = jQuery.parseJSON(dataArray[index]['FormBaseline']);
          var tempObject;

          for (var formID in formDataArray) {
            var elementArray = formDataArray[formID];

            for (var elementID in elementArray) {
              tempObject = new Object();
              tempObject[elementID] = elementArray[elementID];
              $("#" + formID).values(tempObject);
            }
          }

          // Update the shown UID to make sure we're seeing exactly the same as the user
          $("#HelpRequest").html("Your help session keyword is " + dataArray[index]['UserUID']);

          // Set all the elements in all the forms to disabled and set colour to red
          $("form").each(function() {
            $("#" + this.name + " :input").attr("disabled", true);
            $("#" + this.name + " :input").css('color', 'red');
          });

        } else if (dataType == "Mouse") {

          var xActual = ((dataArray[index]['xPercent'] / 100) * screen.width) -50;
          var yActual = ((dataArray[index]['yPercent'] / 100) * screen.height) -50;
          $("#mousething").css("top", yActual);
          $("#mousething").css("left", xActual);
          $("#mouseimage").attr('src', MouseImage.src);

        } else if (dataType == "Scroll") {

          var yActual = ((dataArray[index]['yPercent'] / 100) * screen.height);
          $(window).scrollTop(yActual);


        } else if (dataType == "UpdatePage") {

          var tempObject = new Object();
          var element = dataArray[index]['Element'];
          var value = dataArray[index]['Value'];

          // Time to introduce a terrible, hopefully temporary, hack...
          // This is because it only seems to register successfully for all parts of a set of radio buttons if their IDs are different
          // But... If there IDs are different the 'values' function doesn't then set them correctly...
          if (element.substr(element.length - 5) == "Radio") {
            for(var i = 0; i < element.length; i++) {
              if (element.charAt(i) == element.charAt(i).toUpperCase()) {
                element = element.substring(0, i);
                break;
              }
            }
          }

          tempObject[element] = value;
          $("#" + dataArray[index]['Form']).values(tempObject);

        }

      }

    }

    // Probably should do a setTimeout at zero seconds here
    // as it's currently building a giant pile on the stack
    PollForChanges(userUID);
  });
}

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
