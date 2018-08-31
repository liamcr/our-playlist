(function () {
    "use strict";
    var accessToken = "";
    var userID = "";
    var playlistID = "";
    var repeats = "";
    var explicit = "";
    var songLimit = 0;
    var songs = [];
    var songURIs = [];
    var roomID;

    function updateSongLimitText() {
        document.getElementById("song-limit").innerText = "Limit to Songs Added: " + songLimit + "\nSongs Added: " + (songLimit - sessionStorage.getItem("songLimit" + roomID));
    }

    function getPlaylistData(offset) {
        var urlPlaylist = "https://api.spotify.com/v1/users/" + userID + "/playlists/" + playlistID + "/tracks";

        $.ajax(urlPlaylist, {
            method: 'GET',
            data: { 'offset': offset },
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            success: function (r) {
                for (var i = 0; i < r.items.length; i++) {
                    songURIs.push(r.items[i].track.uri);
                }

                if (songURIs.length === (offset + 100)) {
                    getPlaylistData(offset + 100);
                }
            },
            error: function (r) {
                console.log("Playlist Error: " + r);
            },
            async: false
        });

    }

    function snackbarFunction(id) {
        // Get the snackbar DIV
        var x = document.getElementById(id);

        // Add the "show" class to DIV
        x.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }

    function btnOnClick(ev) {
        // Gets the current button's id
        let id = ev.currentTarget.id;
        var isIn = 0;

        // Add functionality to all buttons except the Search button
        if (id !== "submit") {
            // Button id's are in the format "btn#", so substring(3) gets a number
            let index = parseInt(id.substring(3));

            if (repeats === "N") {
                getPlaylistData();

                for (var i = 0; i < songURIs.length; i++) {
                    if (songs[index].uri === songURIs[i]) {
                        isIn = 1;
                    }
                }

                if (isIn === 0) {
                    if (parseInt(sessionStorage.getItem("songLimit" + roomID)) !== 0) {
                        if (explicit === "N" && songs[index].explicit) {
                            snackbarFunction("explicit");
                        } else {
                            addSong(songs[index].uri);
                            snackbarFunction("added");
                            sessionStorage.setItem("songLimit" + roomID, sessionStorage.getItem("songLimit" + roomID) - 1);

                            updateSongLimitText();
                        }
                    } else {
                        snackbarFunction("over-limit");
                    }
                } else {
                    snackbarFunction("duplicate");
                }
            } else {
                if (parseInt(sessionStorage.getItem("songLimit" + roomID)) !== 0) {
                    addSong(songs[index].uri);
                    snackbarFunction("added");
                    sessionStorage.setItem("songLimit" + roomID, sessionStorage.getItem("songLimit" + roomID) - 1);

                    updateSongLimitText();
                } else {
                    snackbarFunction("over-limit");
                }
            }

            // Reset all values
            document.getElementById("song-name").value = "";
            document.getElementById("results").innerHTML = "";
            songs = [];
        }
    }

    // A Song object
    function Song(title, artists, album, uri, imgUri, explicit) {
        this.title = title;
        this.artists = artists;
        this.album = album;
        this.uri = uri;
        this.imgUri = imgUri;
        this.explicit = explicit;
    }

    // Produces the HTML that is shown for each song in the results
    function convertDataToHTML(song, num) {
        var title = song.title;
        var artists = '';
        var album = song.album;
        var HTML = '';
        var exp = '';
        var i = 0;

        if (title.length > 25) {
            title = title.substring(0, 25) + '...';
        }
        if (album.length > 30) {
            album = album.substring(0, 30) + '...';
        }

        // Formats the artist's names with commas   
        if (song.artists.length > 1) {
            for (i = 0; i < (song.artists.length - 1); i++) {
                artists += song.artists[i].name + ', ';
            }
        }
        artists += song.artists[(song.artists.length - 1)].name;

        if (artists.length > 30) {
            artists = artists.substring(0, 30) + '...';
        }

        if (song.explicit) {
            exp = 'E';
        }


        HTML += '<div class="song-data">\n\t<img style="height: 100px; width: 100px" src="' + song.imgUri + '">\n\t<h3>' + title + '</h3>\n\t<h4>' + artists;

        HTML += '</h4>\n\t<h5><i>' + album + '</i></h5>\n\t<p>' + exp + '</p>\n\t<button id="btn' + num +
            '">Add Song</button>\n</div>';

        return HTML;
    }

    // Adds the song to the playlist
    function addSong(songURI) {
        var urlPost = "https://api.spotify.com/v1/users/"
            + encodeURIComponent(userID)
            + "/playlists/"
            + encodeURIComponent(playlistID)
            + "/tracks?uris="
            + encodeURIComponent(songURI);

        $.ajax(urlPost, {
            method: 'POST',
            dataType: 'text',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            success: function (r) {
                console.log(r);
            },
            error: function (r) {
                console.log("Could not add song:\n" + r);
            }
        });
    }

    // Gets data from the "wanted" column of the row that corresponds to the room number
    function getData(wanted) {
        var returnVal;

        $.ajax({
            type: 'POST',
            url: "getData.php",
            data: { 'room_id': roomID, 'wanted': wanted },
            success: function (data) {
                returnVal = data;
            },
            error: function (data) {
                console.log("getData\n" + data);
            },
            async: false
        });

        return returnVal;
    }

    document.getElementById("back").addEventListener("click", function () {
        window.location.href = "https://ourplaylist.000webhostapp.com";
    });

    document.getElementById("view").addEventListener("click", function () {
        window.location.href = "https://ourplaylist.000webhostapp.com/viewPlaylist.html#" + roomID;
    });

    /*
        Checks if the room number after the # in the URL is valid.
        This is to prevent people from changing that number to a different number
    */
    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            // Sets roomID to the number after the # in the URL
            roomID = parseInt(window.location.hash.substr(1), 10);

            // Redirects the user if the room number is not found in the database
            $.ajax({
                type: 'POST',
                url: "checkRoomID.php",
                data: { 'roomID': roomID },
                success: function (data) {
                    if (data === "Success") {
                        console.log("Room Number Valid");
                    } else {
                        console.log("ERR");
                        window.location.href = "https://ourplaylist.000webhostapp.com/roomNotFound.html";
                    }
                },
                error: function (data) {
                    console.log("checkRoomID:\n" + data);
                }
            });

            // Displays the room number to the user
            document.getElementById("room-number").innerText = "Room Number: " + roomID;

            // Gets the necesary user and playlist data from the database
            accessToken = getData("access_token");
            userID = getData("user_id");
            playlistID = getData("playlist_id");
            repeats = getData("repeats");
            explicit = getData("explicit");
            songLimit = getData("song_limit");

            if (!(sessionStorage.getItem("songLimit" + roomID))) {
                sessionStorage.setItem("songLimit" + roomID, songLimit);
            }

            console.log(repeats);
            console.log(songLimit);

            updateSongLimitText();

        }, 1000);
    });

    document.getElementById("submit").addEventListener("click", function () {
        var songNameInput = document.getElementById("song-name").value;
        var url = "https://api.spotify.com/v1/search";
        var listHTML = "";
        var i;

        songs = [];
        document.getElementById("results").innerHTML = "";
        document.getElementById("error").innerText = "";

        $.ajax(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            data: {
                q: songNameInput,
                type: 'track'
            },
            success: function (r) {
                console.log(r);

                // Populates an array of song results
                for (i = 0; i < r.tracks.items.length; i++) {
                    var nextSong = new Song(r.tracks.items[i].name,
                        r.tracks.items[i].artists,
                        r.tracks.items[i].album.name,
                        r.tracks.items[i].uri,
                        r.tracks.items[i].album.images[0].url,
                        r.tracks.items[i].explicit);

                    songs.push(nextSong);
                }

                if (songs.length === 0) {
                    document.getElementById("error").innerText = "No Results Found";
                }

                // Converts each song to it's HTML format
                for (i = 0; i < songs.length; i++) {
                    listHTML += convertDataToHTML(songs[i], i);
                    listHTML += '\n';
                }

                document.getElementById("results").innerHTML = listHTML;

                // Add functionality to all the buttons that have been created
                let btns = document.querySelectorAll('button');

                btns.forEach(btn => {
                    btn.addEventListener("click", btnOnClick);
                });
            },
            error: function () {
                console.log("error");
            }
        });
    });

})();