<?php
    $room_id = "";
    $access_token = "";
    $user_id = "";
    $playlist_id = "";
    $repeats = "";
    $explicit = "";
    $song_limit = 0;

    if (isset($_POST['room_id'])) {
        $room_id = $_POST['room_id'];
    }
    if (isset($_POST['access_token'])) {
        $access_token = $_POST['access_token'];
    }
    if (isset($_POST['user_id'])) {
        $user_id = $_POST['user_id'];
    }
    if (isset($_POST['playlist_id'])) {
        $playlist_id = $_POST['playlist_id'];
    }
    if (isset($_POST['repeats'])) {
        $repeats = $_POST['repeats'];
    }
    if (isset($_POST['explicit'])) {
        $explicit = $_POST['explicit'];
    }
    if (isset($_POST['song_limit'])) {
        $song_limit = $_POST['song_limit'];
    }

    $db_host = 'localhost';
    $db_username = 'id6502962_liamcrocket';
    $db_password = 'Cljjcfkp0611';
    $db_name = 'id6502962_currentrooms';
        
    if ($room_id !== "") {
        $con = mysqli_connect( $db_host, $db_username, $db_password) or die(mysqli_error($con));
        mysqli_select_db($con, $db_name);
            
        $query = "INSERT INTO rooms (room_id, access_token, user_id, playlist_id, repeats, explicit, song_limit, exp_datetime)
        VALUES ('$room_id', '$access_token', '$user_id', '$playlist_id', '$repeats', '$explicit', $song_limit, date_add(NOW(), INTERVAL 1 hour));";
            
        mysqli_query($con, $query);
    }
?>