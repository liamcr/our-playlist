import React, { useState } from "react";
import SpotifyApiController from "../components/SpotifyApiController";
import PreviewList from "../components/PreviewList";
import SearchBar from "../components/SearchBar";
import { Box, Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  searchBox: {
    textAlign: "center",
    padding: "5vh 0"
  },
  recommendationGrid: {
    width: "90%",
    margin: "0 auto 5vh auto"
  }
});

export default function HomePage() {
  const classes = useStyles();

  const [userTopTracks, setUserTopTracks] = useState(null);
  const [userTopArtists, setUserTopArtists] = useState(null);
  const [userRecommendedAlbums, setUserRecommendedAlbums] = useState(null);
  const [trackRequestSent, setTrackRequestSent] = useState(false);
  const [albumRequestSent, setAlbumRequestSent] = useState(false);
  const [artistRequestSent, setArtistRequestSent] = useState(false);

  // Gets a list of album ids based on the user's top tracks
  const getRecommendedAlbums = topTracks => {
    let albumArr = [];

    for (let track of topTracks) {
      if (
        track.album.album_type === "ALBUM" &&
        !albumArr.includes(track.album.id)
      ) {
        albumArr.push(track.album.id);
      }
    }

    return albumArr;
  };

  const buildString = stringArr => {
    return stringArr.slice(1).reduce((prevString, nextString) => {
      return `${prevString},${nextString}`;
    }, stringArr[0]);
  };

  SpotifyApiController.handleLogin();

  if (!trackRequestSent) {
    setTrackRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50",
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setUserTopTracks(res.data.items);
    });
  }

  if (!artistRequestSent) {
    setArtistRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50",
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setUserTopArtists(res.data.items);
    });
  }

  if (userTopTracks && !albumRequestSent) {
    setAlbumRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/albums?ids=${encodeURIComponent(
        buildString(getRecommendedAlbums(userTopTracks))
      )}`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setUserRecommendedAlbums(res.data.albums);
    });
  }

  return (
    <div>
      <Box className={classes.searchBox}>
        <SearchBar main />
      </Box>

      <Grid
        container
        justify="space-around"
        spacing={3}
        className={classes.recommendationGrid}
      >
        <Grid item xs={4}>
          <PreviewList
            limit={10}
            homePage
            title="Tracks"
            dataType="track"
            data={userTopTracks}
          />
        </Grid>
        <Grid item xs={4}>
          <PreviewList
            limit={10}
            homePage
            title="Albums"
            dataType="album"
            data={userRecommendedAlbums}
          />
        </Grid>
        <Grid item xs={4}>
          <PreviewList
            limit={10}
            homePage
            title="Artists"
            dataType="artist"
            data={userTopArtists}
          />
        </Grid>
      </Grid>
    </div>
  );
}
