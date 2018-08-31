(function () {
    "use strict";

    var accessToken = "";
    var userID = "";
    var playlistID = "";
    var playlistName = "";
    var innerHTMLSongs = "";
    var songs = [];
    var roomID;

    // Produces the HTML that is shown for each song in the playlist
    function convertSongToHTML(song) {
        var title = song.name;
        var artists = '';
        var album = song.album.name;
        var HTML = '';
        var explicit = '';
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
            explicit = 'E';
        }


        HTML += '<div class="song-data">\n\t<img style="height: 100px; width: 100px" src="' + song.album.images[0].url + '">\n\t<h3>' + title + '</h3>\n\t<h4>' + artists;

        HTML += '</h4>\n\t<h5><i>' + album + '</i></h5>\n\t<p>' + explicit + '</p>\n</div>';

        return HTML;
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
                    songs.push(r.items[i].track);
                }

                if (songs.length === (offset + 100)) {
                    getPlaylistData(offset + 100);
                }
            },
            error: function (r) {
                console.log("Playlist Error: " + r);
            },
            async: false
        });
    }

    function getPlaylistName() {
        var urlPlaylist = "https://api.spotify.com/v1/users/" + userID + "/playlists/" + playlistID;

        $.ajax(urlPlaylist, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
            },
            success: function (r) {
                playlistName = r.name;
            },
            error: function (r) {
                console.log("Playlist Error: " + r);
            },
            async: false
        });
    }

    document.getElementById("back").addEventListener("click", function () {
        window.location.href = "https://ourplaylist.000webhostapp.com/addSongs.html#" + roomID;
    });

    document.addEventListener("DOMContentLoaded", function () {
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

        accessToken = getData("access_token");
        userID = getData("user_id");
        playlistID = getData("playlist_id");

        getPlaylistData(0);
        getPlaylistName();

        document.getElementById("playlist-name").innerText = 'Showing Tracks For "' + playlistName + '"';

        if (songs.length === 0) {
            document.getElementById("error").innerText = "This Playlist is Empty";
        } else {
            for (var i = 0; i < songs.length; i++) {
                innerHTMLSongs += convertSongToHTML(songs[i]);
                innerHTMLSongs += '\n';
            }

            document.getElementById("songs").innerHTML = innerHTMLSongs;
        }
    });
})()