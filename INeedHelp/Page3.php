<html>
  <head>
    <script src="INeedHelp.js"></script>
    <link rel="stylesheet" type="text/css" href="INeedHelp.css">
  </head>

  <body onload="ExistingHelpSessionCheck()">

    <div id="Header"><img src="../Common/Header.png"></div><p>

    <div id="Area">Registering for a for Tax Disc Registration : Page 3</div><p>

    <div id="ExampleForm1">Please enter your document details:</div><p>

    <form id='aForm' name='aForm' action='javascript:void(0);' method='get'>
      Driving License Number:<br> 
      <input type='text' id='licenseNumber' name='licenseNumber'><p>
      Insurance Number:<br> 
      <input type='text' id='insuranceNumber' name='insuranceNumber'><p>
    </form><p>

    <form id='bForm' name='bForm' action='Page4.php' method='get'>
      MOT valid for how many months?:<br>
      <select id='MOT' name='MOT'>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      </select><p>

      SORN Off-Road:<br>
      <input type="radio" name="SORN" id="SORN" value="yes">Yes<br>
      <input type="radio" name="SORN" id="SORN" value="no">No
      <p>
    
      <input type="submit" value="Finish"><p>

    </form><p>

    <hr align="left" width="20%" size="3"/><p>

    <div id='HelpRequest'><button type='button' onclick='DoIt("NewCall")'>Request Help</button></div>

  </body>
</html>