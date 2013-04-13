<?php

include "Utils.php";

// Fetch data from the database
$mysqli = new mysqli("localhost", "bowsy", "VU8Jc7ccirsre73", "bowsy_PageClone");

$queryString = "SELECT UserHTML FROM HelpRequests WHERE UserUID='" . $_GET['UserUID'] . "'";
$result = $mysqli->query($queryString);
$resultArray = $result->fetch_array(MYSQLI_ASSOC);

print(json_encode($resultArray));

?>