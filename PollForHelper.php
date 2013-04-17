<?php

include "Utils.php";

// Fetch data from the database
$mysqli = ConnectToDB();

$queryString = "SELECT HelperUID FROM HelpRequests WHERE UserUID='" . $_GET['UID'] . "'";
$result = $mysqli->query($queryString);

if ($result->num_rows == 0) {
  print "";
} else {
  $row = $result->fetch_array(MYSQLI_ASSOC);
  print $row['HelperUID'];
}

?>