<?php

include "../Common/Logging.php";

$word = file_get_contents("http://randomword.setgetgo.com/get.php");

// String off the CR
$word = substr($word, 0, -2);

print($word);

?>