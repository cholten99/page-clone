<?php

// Clean testing log
function ClearLog() {
  $fp = fopen('TestLog.txt', 'w');
  fclose($fp);
}

// Log for testing
function TestLog($toLog) {
  $fp = fopen('TestLog.txt', 'a');
  $toLog = date("d/m/y H:s > ") . $toLog . "\n";
  fwrite($fp, $toLog);
  fclose($fp);
}

// Log array for testing
function TestLogArray($toLog) {
  ob_start();
  var_dump($toLog);
  $result = ob_get_clean();
  TestLog($result);
}

// Connect to the database
function ConnectToDB() {
  return(new mysqli("localhost", "bowsy", "VU8Jc7ccirsre73", "bowsy_PageClone"));
}

// Add a row to a database - return the new row number
function DatabaseAdd($dbArgs) {
  $table = $dbArgs['Table'];
  unset($dbArgs['Table']);

  $mysqli = ConnectToDB();

  $fields = "";
  $values = "";
  foreach ($dbArgs as $key => $value) {
    $fields .= "" . $key . ",";
    $values .= "\"" . $mysqli->real_escape_string(stripslashes($value)) . "\",";
  }
  $fields = rtrim($fields, ",");
  $values = rtrim($values, ",");

  $insertString = "INSERT INTO " . $table . " (" . $fields . ") VALUES (" . $values . ")";
  $mysqli->query($insertString);

  return($mysqli->insert_id);
}

?>