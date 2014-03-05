<?php

// include "../Common/Logging.php";
// ClearLog();

$theArray = array();
$loopCount = 0;

$UserUID = $_GET['UserUID'];

$mysqli = new mysqli("localhost", "bowsy", "VU8Jc7ccirsre73", "bowsy_PageClone");

while (1) {

  // InitialisePage
  $queryString = "SELECT * FROM InitialisePage WHERE UserUID='" . $UserUID . "'";
  $result = $mysqli->query($queryString);
  while($row = $result->fetch_assoc()) {
    $row['Type'] = "InitialisePage";
    $theArray[] = $row;
  }

  if ($result->num_rows != 0) {
    $sql = "DELETE FROM InitialisePage WHERE UserUID='" . $UserUID . "'";
    $mysqli->query($sql);
  }

  // UpdatePage
  $queryString = "SELECT * FROM UpdatePage WHERE UserUID='" . $UserUID . "'";
  $result = $mysqli->query($queryString);
  while($row = $result->fetch_assoc()) {
    $row['Type'] = "UpdatePage";
    $theArray[] = $row;
  }

  if ($result->num_rows != 0) {
    $sql = "DELETE FROM UpdatePage WHERE UserUID='" . $UserUID . "'";
    $mysqli->query($sql);
  }

  // Mouse
  $queryString = "SELECT * FROM Mouse WHERE UserUID='" . $UserUID . "'";
  $result = $mysqli->query($queryString);
  while($row = $result->fetch_assoc()) {
    $row['Type'] = "Mouse";
    $theArray[] = $row;
  }

  if ($result->num_rows != 0) {
    $sql = "DELETE FROM Mouse WHERE UserUID='" . $UserUID . "'";
    $mysqli->query($sql);
  }

  // Scroll
  $queryString = "SELECT * FROM Scroll WHERE UserUID='" . $UserUID . "'";
  $result = $mysqli->query($queryString);
  while($row = $result->fetch_assoc()) {
    $row['Type'] = "Scroll";
    $theArray[] = $row;
  }

  if ($result->num_rows != 0) {
    $sql = "DELETE FROM Scroll WHERE UserUID='" . $UserUID . "'";
    $mysqli->query($sql);
  }


  if (count($theArray) == 0) {
    // Currently no data, wait for a second and loop around again
    sleep(1);

    // If there's been no input for 10 seconds drop the AJAX connection
    // It'll be reconnected by the client
    if ($loopCount == 10) {
      print(json_encode("Null"));
      break;
    } else {

      $loopCount++;
    }

  } else {
    // We've got some data to return
    usort($theArray, function($a, $b)
    {
      return(strcmp($a["Timestamp"], $b["Timestamp"]));
    });

    $mysqli->close();

    print(json_encode($theArray));

    // Exit the while loop
    break;
  }

}
?>