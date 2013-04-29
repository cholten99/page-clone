<?php

include "Logging.php";

// MAIN - Call the appropriate function
$function = "";
if (empty($_GET['Function'])) {
  $function = $_POST['Function'];
  $dbArray = $_POST;
} else {
  $function = $_GET['Function'];
  $dbArray = $_GET;
}

unset($dbArray['Function']);
$returnedArray = call_user_func($function, $dbArray);
print(json_encode($returnedArray));
// MAIN Ends


// Connect to the database
function ConnectToDB() {
  return(new mysqli("localhost", "bowsy", "VU8Jc7ccirsre73", "bowsy_PageClone"));
}

// Get all the fields in a row given the UserUID
function GetWholeRow(&$dbArray) {
  $mysqli = ConnectToDB();
  $queryString = "SELECT * FROM HelpRequests WHERE UserUID='" . $dbArray['UserUID'] . "'";
  $result = $mysqli->query($queryString);
  $row = $result->fetch_array(MYSQLI_ASSOC);
  $mysqli->close();
  return $row;
}

function GetFieldsForRow(&$dbArray) {
  $userUID = $dbArray['UserUID'];
  unset($dbArray['UserUID']);

  $mysqli = ConnectToDB();
  
  $fields = "";
  foreach ($dbArray as $key => $value) {
    $fields .= $key . ",";
  }
  $fields = rtrim($fields, ",");

  $queryString = "SELECT " . $fields . " FROM HelpRequests WHERE UserUID='" . $userUID . "'";
  $result = $mysqli->query($queryString);
  $row = $result->fetch_array(MYSQLI_ASSOC);
  $mysqli->close();
  return $row;
}

// Get the supplied fields for all rows in the DB 
function GetAllRowsForFields(&$dbArray) {
  $mysqli = ConnectToDB();

  $fields = "";
  foreach ($dbArray as $key => $value) {
    $fields .= $key . ",";
  }
  $fields = rtrim($fields, ",");

  $queryString = "SELECT " . $fields . " FROM HelpRequests";
  $result = $mysqli->query($queryString);

  $returnArray = array();
  while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
    $returnArray[] = $row;
  }

  $mysqli->close();
  return($returnArray);
}

function UpdateRow(&$dbArray) {
  $userUID = $dbArray['UserUID'];
  unset($dbArray['UserUID']);

  $mysqli = ConnectToDB();
  $updateString = "UPDATE HelpRequests SET ";

  foreach ($dbArray as $key => $value) {
    $updateString .= $key . "='" . $value . "',";  
  }
  $updateString = rtrim($updateString, ",");

  $updateString .= " WHERE UserUID='" . $userUID . "'";
  $mysqli->query($updateString);

  $mysqli->close();
  return(null);
}

// Add a row to the database - return the new row number
function AddRow(&$dbArray) {
  $mysqli = ConnectToDB();
  $fields = "";
  $values = "";
  foreach ($dbArray as $key => $value) {
    $fields .= "" . $key . ",";
    $values .= "\"" . $mysqli->real_escape_string(stripslashes($value)) . "\",";
  }
  $fields = rtrim($fields, ",");
  $values = rtrim($values, ",");

  $insertString = "INSERT INTO HelpRequests (" . $fields . ") VALUES (" . $values . ")";
  $mysqli->query($insertString);
  $mysqli->close();
}

// Remove a row from the database
function DeleteRow(&$dbArray) {
  $mysqli = ConnectToDB();
  $deleteString = "DELETE FROM HelpRequests WHERE UserUID='" . $dbArray['UserUID'] . "'";
  $mysqli->query($deleteString);
  $mysqli->close();
}

?>