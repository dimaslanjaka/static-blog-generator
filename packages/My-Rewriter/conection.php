<?php
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $dbnama = "db_myrewriter";
    $dbcon = mysql_connect($dbhost, $dbuser, $dbpass) or die("Database Error");
    $tesdb = mysql_select_db($dbnama, $dbcon) or die ("database $dbnama tidak bisa diakses");
?>