import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, makeStyles } from "@material-ui/core";
import PageHeader from "../components/PageHeader";
import AlbumArtist from "../components/AlbumArtist";
import SpotifyApiController from "../components/SpotifyApiController";
import AlbumGeneralInfo from "../components/AlbumGeneralInfo";
import AlbumTracks from "../components/AlbumTracks";
import { config } from "../config";

const useStyles = makeStyles({
  gridContainer: {
    width: "90%",
    margin: "10px auto"
  }
});

export default function Album() {
  let { id } = useParams();
  const classes = useStyles();

  const [albumObj, setAlbumObj] = useState(null);
  const [albumRequestSent, setAlbumRequestSent] = useState(false);

  const getYear = album => {
    return album.release_date.slice(0, 4);
  };

  if (!SpotifyApiController.isLoggedIn()) {
    window.location.href = config.homePageURL;
  }

  if (!albumRequestSent) {
    setAlbumRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/albums/${id}`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setAlbumObj(res.data);
    });
  }

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      className={classes.gridContainer}
    >
      <Grid item xs={12}>
        <PageHeader
          name={albumObj ? albumObj.name : null}
          artists={albumObj ? albumObj.artists : null}
          subtitle={albumObj ? getYear(albumObj) : null}
          images={albumObj ? albumObj.images : null}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AlbumArtist album={albumObj} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AlbumGeneralInfo album={albumObj} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AlbumTracks album={albumObj} />
      </Grid>
    </Grid>
  );
}
