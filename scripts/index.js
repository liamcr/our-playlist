(function() {
"use strict";

    const clientID = "c3f3e29b9d174e9998b082e0c9573fd6";
    var redirectURI = "https://partymix.000webhostapp.com/newPlaylist.html";
    var scopes = ["playlist-read-private", "playlist-read-collaborative", "playlist-modify-private", "playlist-modify-public"]

    var userURL = "https://accounts.spotify.com/authorize?client_id=" + clientID +
        "&redirect_uri=" + encodeURIComponent(redirectURI) +
        "&scope=" + encodeURIComponent(scopes.join(' ')) +
        "&response_type=token";

    function snackbarFunction() {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
    
    document.getElementById("new-room").addEventListener("click", function() {
        window.location.href = userURL;
    });

    document.addEventListener("DOMContentLoaded", function() {
        // Delete all expired access tokens from the database using "deleteExpired.php"
        $.ajax({
            type: 'POST',
            url: "deleteExpired.php",
            success: function(data) {
                console.log("Rooms deleted");
            },
            error: function(data) {
                console.log(data);
            }
        });
    });
    
    document.getElementById("join-room").addEventListener("click", function() {
        var roomID = document.getElementById("room-id").value;
        
        // Checks if the given room number is in the database
        $.ajax({
            type: 'POST',
            url: "checkRoomID.php",
            data: {'roomID': roomID},
            success: function(data) {
                if (data === "Success") {
                    window.location.href = "https://partymix.000webhostapp.com/addSongs.html#"
                        + encodeURIComponent(roomID);
                } else {
                    snackbarFunction();
                }
            },
            error: function(data) {
                console.log(data);
            }
        });
    })
})()
