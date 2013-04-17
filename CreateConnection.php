<?php

include "Utils.php";

// Fetch data from the database
$mysqli = ConnectToDB();

$updateStatusString = "UPDATE HelpRequests SET Status='Connected' WHERE UserUID='" . $_GET['UserUID'] . "'";
$updateStatusResult = $mysqli->query($updateStatusString);

$updateHelperUIDString = "UPDATE HelpRequests SET HelperUID='" . $_GET['HelperUID'] . "' WHERE UserUID='" . $_GET['UserUID'] . "'";
$updateHelperUIDResult = $mysqli->query($updateHelperUIDString);

$queryString = "SELECT UserHTML FROM HelpRequests WHERE UserUID='" . $_GET['UserUID'] . "'";
$queryResult = $mysqli->query($queryString);
$resultArray = $queryResult->fetch_array(MYSQLI_ASSOC);

print(json_encode($resultArray));

?>