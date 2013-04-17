<?php

include "Utils.php";

$mysqli = ConnectToDB();
$deleteString = "DELETE FROM HelpRequests WHERE UserUID='" . $_GET['UID'] . "'";

$mysqli->query($deleteString);

?>