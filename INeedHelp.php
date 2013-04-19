<?php

include "Utils.php";

// Store initial help request information
$dbArgs['Table'] = "HelpRequests";
$dbArgs['UserUID'] = $_POST['UID'];
$dbArgs['UserHTML'] = $_POST['HTML'];
$dbArgs['UserHTMLTimestamp'] = 0;
$dbArgs['UserFormData'] = $_POST['UserFormData'];
$dbArgs['UserFormDataTimestamp'] = 0;
$dbArgs['Status'] = "Open";
$dbArgs['HelperUID'] = "Unasigned";

DatabaseAdd($dbArgs);

?>