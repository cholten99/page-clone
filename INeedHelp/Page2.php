<html>
  <head>
    <script src="INeedHelp.js"></script>
    <link rel="stylesheet" type="text/css" href="http://bowsy.me.uk/PageClone/INeedHelp/INeedHelp.css">
  </head>

  <body onload="ExistingHelpSessionCheck()">

    <div id='HelpRequest'><button type='button' onclick='SetUpSession("NewCall")'>Request Help</button></div><p/>

    <div id="Header"><img src="../Common/Header.png"></div><p>

    <div id="Area">Registering for a for Tax Disc Registration : Page 2</div><p>

    <div id="ExampleForm1">Please enter your vehicle details:</div><p>

    <form id='aForm' name='aForm' action='javascript:void(0);' method='get'>
      Year made:<br> 
      <input type='text' id='yearMade' name='yearMade'><p>
    </form><p>

    <form id='bForm' name='bForm' action='Page3.php' method='get'>
      Model:<br>
      <select id='model' name='model'>
        <option value="Ford">Ford</option>
        <option value="Jaguar">Jaguar</option>
        <option value="Smart">Smart</option>
        <option value="BMW">BMW</option>
      </select><p>

      Gearbox Type:<br>
      <input type="radio" name="gearbox" id="gearboxManualRadio" value="manual">Manual<br>
      <input type="radio" name="gearbox" id="gearboxAutomaticRadio" value="automatic">Automatic
      <p>
    
      <input type="submit" value="Next"><p>

    </form><p>

  </body>
</html>