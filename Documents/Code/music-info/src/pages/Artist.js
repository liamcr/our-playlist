import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, makeStyles } from "@material-ui/core";
import PageHeader from "../components/PageHeader";
import ArtistGeneralInfo from "../components/ArtistGeneralInfo";
import ArtistTopTracks from "../components/ArtistTopTracks";
import ArtistAlbums from "../components/ArtistAlbums";
import SpotifyApiController from "../components/SpotifyApiController";
import { config } from "../config";

const useStyles = makeStyles({
  gridContainer: {
    width: "90%",
    margin: "10px auto"
  }
});

export default function Artist() {
  let { id } = useParams();
  const classes = useStyles();

  const [artistObj, setArtistObj] = useState(null);
  const [artistRequestSent, setArtistRequestSent] = useState(false);

  if (!SpotifyApiController.isLoggedIn()) {
    window.location.href = config.homePageURL;
  }

  if (!artistRequestSent) {
    setArtistRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/artists/${id}`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setArtistObj(res.data);
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
          name={artistObj ? artistObj.name : null}
          images={artistObj ? artistObj.images : null}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <ArtistGeneralInfo artist={artistObj} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <ArtistTopTracks id={id} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <ArtistAlbums id={id} />
      </Grid>
    </Grid>
  );
}
