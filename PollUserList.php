<?php

include "Utils.php";

// Fetch data from the database
$mysqli = ConnectToDB();

$queryString = "SELECT UserUID FROM HelpRequests";
$result = $mysqli->query($queryString);

$userArray = array();
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
  $userArray[] = $row['UserUID'];
}

print(json_encode($userArray));

?>