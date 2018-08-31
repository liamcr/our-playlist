<?php
    $room_id = 0;
    $wanted = "";
    $wantedResult = "";
    $db_host = 'localhost';
    $db_username = 'id6502962_liamcrocket';
    $db_password = 'Cljjcfkp0611';
    $db_name = 'id6502962_currentrooms';
    
    // Makes sure there are variables passed to 'room_id' and 'wanted' before looking for them
    if (isset($_POST['room_id'])) {
        $room_id = $_POST['room_id'];
    }
    if (isset($_POST['wanted'])) {
        $wanted = $_POST['wanted'];
    }
    
    $con = mysqli_connect($db_host, $db_username, $db_password);
    mysqli_select_db($con, $db_name);

    $query = "SELECT * FROM `rooms` WHERE room_id=$room_id";
    
    // Check if the query is valid
    if ($result = mysqli_query($con, $query)) {    
        $row = mysqli_fetch_assoc($result);
        $wantedResult = $row[$wanted];
                
        echo $wantedResult;
    } else {
        echo "ERROR".mysqli_error($con);
    }

?>