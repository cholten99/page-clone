<?php

// Clean testing log
function ClearLog() {
  $fp = fopen('TestLog.txt', 'w');
  fclose($fp);
}

// Log for testing
function TestLog($toLog) {
  $fp = fopen('TestLog.txt', 'a');
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

// Store initial help request information
function HelpRequest($args) {
  $incoming = file_get_contents('HelpCache.txt');
  $cacheArray = json_decode($incoming, True);
  
  array_push($cacheArray, $args);

  $outputString = json_encode($cacheArray);

  $fp = fopen('HelpCache.txt', 'w');
  fwrite($fp, $outputString);
  fclose($fp);
}

function SendUsersList() {
  $incoming = file_get_contents('HelpCache.txt');
  $cacheArray = json_decode($incoming, True);

  $nameArray = array();
  for ($i=0; $i < count($cacheArray); $i++) {
    $UID = $cacheArray[$i]['UID'];
    array_push($nameArray, $UID);
  }
  $returnString = json_encode($nameArray);

  return $returnString;
}

function SendInitialPage($args) {
  $incoming = file_get_contents('HelpCache.txt');
  $cacheArray = json_decode($incoming, True);

  for ($i=0; $i < count($cacheArray); $i++) {
    if ($cacheArray[$i]['UID'] == $args['UID']) {
      $returnArray = array();
      $returnArray['HTML'] = $cacheArray[$i]['HTML'];
      $returnArray['Scroll'] = $cacheArray[$i]['Scroll'];
      $returnString = json_encode($returnArray);

      return $returnString;
    }
  }  
}

// MAIN
// Handle the incoming request - of whatever kind

//ClearLog();

$funcNumber = 0;
$args = array();
if (array_key_exists('funcNumber', $_GET)) {
  $funcNumber = $_GET['funcNumber'];
  $args = $_GET;
} else {
  $funcNumber = $_POST['funcNumber'];
  $args = $_POST;
}
unset ($args['funcNumber']);

switch ($funcNumber) {
  case 1:
    // Store incoming help request
    HelpRequest($args);
    break;
  case 2:
    // Send list of users asking for help
    print(SendUsersList());
    break;
  case 3:
    // Send requested initial asking-for-help page
    print(SendInitialPage($args));
    break;
}

?>