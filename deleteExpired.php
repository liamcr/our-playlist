<?php
    /*
        This goes through and deletes any row from the database that has an expiration date that has already
        passed
    */

    $db_host = 'localhost';
    $db_username = 'id6502962_liamcrocket';
    $db_password = 'Cljjcfkp0611';
    $db_name = 'id6502962_currentrooms';    

    $con = mysqli_connect($db_host, $db_username, $db_password);
    mysqli_select_db($con, $db_name);

    $query = "DELETE FROM `rooms` WHERE exp_datetime <= NOW()";
    
    mysqli_query($con, $query);
?>