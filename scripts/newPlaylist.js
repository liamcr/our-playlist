(function() {
"use strict";
    var localAccessKey = "";
    var userID = "";
    var playlistID = "";
    var currentPlaylists = [];
    
    function snackbarFunction() {
        // Get the snackbar DIV
        var x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    function getInnerHTML() {
        var innerHTML = "";

        innerHTML += '<option value="default">Select Current Playlist...</option>\n';

        for (var i = 0; i < currentPlaylists.length; i++) {
            innerHTML += '<option value="' + i + '">' + currentPlaylists[i].name + '</option>\n';
        }

        document.getElementById("playlists").innerHTML = innerHTML;
    }

    function getUserID() {
        var url = "https://api.spotify.com/v1/me";

        $.ajax(url, {
            dataType: 'json',
            headers: {
			    'Authorization': 'Bearer ' + localAccessKey,
		    },
		    success: function(r) {
		        userID = r.id;
		    },
		    error: function(r) {
		        console.log("Error, could not get user ID\n" + r);
            },
            async: false
        });
    }

    function getPlaylistData() {
        var playlistURL = "https://api.spotify.com/v1/users/" + userID + "/playlists";
        var playlistArray = [];

        $.ajax(playlistURL, {
            type: 'GET',
            headers: {
			    'Authorization': 'Bearer ' + localAccessKey,
            },
            success: function(r) {
                for (var i = 0; i < r.items.length; i++) {
                    if (r.items[i].owner.id === userID) {
                        playlistArray.push(r.items[i]);
                    }
                }
            },
            error: function(r) {
                console.log("Error getting playlist data");
            },
            async: false
        });

        return playlistArray;
    }
    
    // Checks if the random room number has been taken already
    function checkRoomID(roomID) {
        var response = "";
        
        $.ajax({
            type: 'POST',
            url: "checkRoomID.php",
            data: {'roomID': roomID},
            success: function(data) {
                if (data === "Success") {
                    response = "n";
                } else {
                    response = "y";
                }
            },
            error: function(data) {
                console.log("checkRoomID: " + data);
            }
        });
        
        return response;
    }

    // Parses the URL to obtain the access token
    function parseURLHash () {
        var search = location.hash.substring(1);
        var urlHash = search?JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
                     function(key, value) { return key===""?value:decodeURIComponent(value) }):{};
                     
        console.log(urlHash);
        console.log(urlHash.access_token);
        var s = urlHash.access_token;
    
        localAccessKey = s;
    }
    parseURLHash();
    
    // Creates a new playlist on the user's account
    function createPlaylist(userID, name, description) {
        var urlPlaylist = 'https://api.spotify.com/v1/users/' + encodeURIComponent(userID) + '/playlists';
                    
        $.ajax(urlPlaylist, {
		    method: 'POST',
		    data: JSON.stringify({
			    'name': name,
			    'description': description,
			    'public': false
		    }),
		    dataType: 'json',
	    	headers: {
			    'Authorization': 'Bearer ' + localAccessKey,
			    'Content-Type': 'application/json'
		    },
		    success: function(r) {
		        playlistID = r.id;
			    console.log('create playlist response', r);
		    },
		    error: function(r) {
		        console.log('Error', r);
		    }
	    });
    }

    document.addEventListener("DOMContentLoaded", function() {
        getUserID();

        currentPlaylists = getPlaylistData();

        getInnerHTML();
    });

    document.getElementById("back").addEventListener("click", function() {
        window.location.href = "https://partymix.000webhostapp.com";
    });

    document.getElementById("playlists").addEventListener("change", function() {
        if (document.getElementById("playlists").value !== "default") {
            document.getElementById("name").disabled = true;
            document.getElementById("description").disabled = true;

            document.getElementById("name").value = "";
            document.getElementById("description").value = "";
        } else {
            document.getElementById("name").disabled = false;
            document.getElementById("description").disabled = false;
        }
    })
    
    document.getElementById("create-playlist").addEventListener("click", function() {
        var playlistName = "";
        var playlistDescription = document.getElementById("description").value;
        var roomNum;
        var repeats = document.getElementById("repeats").value;
        var explicit = document.getElementById("explicit-option").value;
        var songLimit = document.getElementById("song-limit").value;
        
        if (document.getElementById("playlists").value === "default") {
            // Sets default values to playlist names if the user does not give one
            if (document.getElementById("name").value === "") {
                playlistName = "Our Playlist";
            } else {
                playlistName = document.getElementById("name").value;
            }
            
            createPlaylist(userID, playlistName, playlistDescription);
        } else {
            var index = 0;

            index = parseInt(document.getElementById("playlists").value);

            playlistID = currentPlaylists[index].id
        }

        snackbarFunction();
        
        setTimeout(function() {
            // Generates a random room id
            do {
                roomNum = Math.floor((Math.random() * 9999) + 1);
            } while (checkRoomID(roomNum) === "n");
            
            // Adds the data to the database
            $.post("newPlaylist.php",
                    {'room_id':roomNum,'access_token':localAccessKey,'user_id':userID,'playlist_id':playlistID,'repeats':repeats,'explicit':explicit,'song_limit':songLimit},
                    function(data) {
                        console.log(data);
                    });
        
            window.location.href = "https://partymix.000webhostapp.com/addSongs.html#"
                + encodeURIComponent(roomNum);
        }, 2000);
    });

})();
