<?php

include "Utils.php";

// Fetch data from the database
$mysqli = ConnectToDB();

$updateUserFormData = "UPDATE HelpRequests SET UserFormData='" . $_POST['UserFormData'] . "' WHERE UserUID='" . $_POST['UserUID'] . "'";
$updateUserFormDataResult = $mysqli->query($updateUserFormData);

$secondsSinceEpoc = time();

$updateUserFormDataTimestamp = "UPDATE HelpRequests SET UserFormDataTimestamp=" . $secondsSinceEpoc . " WHERE UserUID='" . $_POST['UserUID'] . "'";
$updateUserFormDataTimestampResult = $mysqli->query($updateUserFormDataTimestamp);

?>