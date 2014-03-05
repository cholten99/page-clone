<html>
  <head>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="RemoteTab.js?v=9"></script>
    <script src="../Common/Utils.js"></script>
  </head>
  <body onload="PollForChanges('<?php print($_GET['UserUID']); ?>')">
  <div id="ChangeMe"></div>
  <div id="mousething"><img id="mouseimage"/></div>
  </body>
</html>