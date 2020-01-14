import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SpotifyApiController from "../components/SpotifyApiController";
import { Box, Grid, makeStyles } from "@material-ui/core";
import PreviewList from "../components/PreviewList";
import SearchBar from "../components/SearchBar";
import { config } from "../config";

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

export default function GetStarted() {
  let { query } = useParams();
  const classes = useStyles();

  const [searchResult, setSearchResult] = useState(null);
  const [albumsResult, setAlbumsResult] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [albumRequestSent, setAlbumRequestSent] = useState(false);

  const getAlbumIds = simplifiedAlbums => {
    let albumArr = [];

    for (let album of simplifiedAlbums) {
      if (
        album.album_type.toLowerCase() === "album" &&
        !albumArr.includes(album.id)
      ) {
        albumArr.push(album.id);
      }
    }

    return albumArr;
  };

  const buildString = stringArr => {
    return stringArr.slice(1).reduce((prevString, nextString) => {
      return `${prevString},${nextString}`;
    }, stringArr[0]);
  };

  if (!SpotifyApiController.isLoggedIn()) {
    window.location.href = config.homePageURL;
  }

  if (!requestSent) {
    setRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/search?q=${query}&type=artist%2Calbum%2Ctrack`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setSearchResult(res.data);
    });
  }

  if (searchResult && !albumRequestSent) {
    setAlbumRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/albums?market=from_token&ids=${encodeURIComponent(
        buildString(getAlbumIds(searchResult.albums.items))
      )}`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setAlbumsResult(res.data.albums);
    });
  }

  return (
    <div>
      <Box className={classes.searchBox}>
        <SearchBar main query={query} />
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
            title="Tracks"
            dataType="track"
            data={searchResult === null ? null : searchResult.tracks.items}
          />
        </Grid>
        <Grid item xs={4}>
          <PreviewList
            limit={10}
            title="Albums"
            dataType="album"
            data={albumsResult}
          />
        </Grid>
        <Grid item xs={4}>
          <PreviewList
            limit={10}
            title="Artists"
            dataType="artist"
            data={searchResult === null ? null : searchResult.artists.items}
          />
        </Grid>
      </Grid>
    </div>
  );
}
