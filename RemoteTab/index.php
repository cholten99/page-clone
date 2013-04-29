<html>
  <head>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="RemoteTab.js?v=2"></script>
    <script src="../Common/Utils.js"></script>
  </head>
  <body onload="PollForChanges('<?php print($_GET['UserUID']); ?>', 0, 0)">
  <div id="ChangeMe"></div>
  </body>
</html>