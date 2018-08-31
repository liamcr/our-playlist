<?php
    /*
        This echos "Success" if the value passed to it is found within the database
    */
    
    $room_id = 0;
    $db_host = 'localhost';
    $db_username = 'id6502962_liamcrocket';
    $db_password = 'Cljjcfkp0611';
    $db_name = 'id6502962_currentrooms';
    
    if (isset($room_id)) {
        $room_id = $_POST['roomID'];
    }
    
    $con = mysqli_connect($db_host, $db_username, $db_password);
    mysqli_select_db($con, $db_name);

    $query = "SELECT * FROM `rooms` WHERE room_id=$room_id";
        
    if ($result = mysqli_query($con, $query)) {
        if (mysqli_num_rows($result) != 0) {
            echo "Success";
        } else {
            echo "Fail";
        }
    } else {
        echo "ERROR";
    }

?>