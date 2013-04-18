<?php

include "Utils.php";

// Store initial help request information
$dbArgs['Table'] = "HelpRequests";
$dbArgs['UserUID'] = $_POST['UID'];
$dbArgs['UserHTML'] = $_POST['HTML'];
$dbArgs['Status'] = "Open";
$dbArgs['HelperUID'] = "Unasigned";
$dbArgs['UserFormData'] = $_POST['UserFormData'];

DatabaseAdd($dbArgs);

?>