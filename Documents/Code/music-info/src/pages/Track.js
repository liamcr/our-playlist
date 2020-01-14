import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, makeStyles } from "@material-ui/core";
import PageHeader from "../components/PageHeader";
import AlbumArtist from "../components/AlbumArtist";
import TrackAlbum from "../components/TrackAlbum";
import AudioFeatures from "../components/AudioFeatures";
import SpotifyApiController from "../components/SpotifyApiController";
import TrackGeneralInfo from "../components/TrackGeneralInfo";
import AudioAnalysis from "../components/AudioAnalysis";
import { config } from "../config";

const useStyles = makeStyles({
  gridContainer: {
    width: "90%",
    margin: "10px auto"
  }
});

export default function Track() {
  let { id } = useParams();
  let interval;
  const classes = useStyles();

  const [trackObj, setTrackObj] = useState(null);
  const [trackRequestSent, setTrackRequestSent] = useState(false);
  const [player, setPlayer] = useState(null);
  const [playerAttemptedToBeSet, setPlayerAttemptedToBeSet] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const initializePlayer = (name, token) => {
    if (window.Spotify !== null && window.Spotify !== undefined) {
      let player = new window.Spotify.Player({
        name: name,
        getOAuthToken: cb => {
          cb(token);
        }
      });
      clearInterval(interval);
      player.connect().then(success => {
        if (success) {
          console.log("Successful");

          player.on("ready", () => {
            setPlayerReady(true);
          });
        }
      });

      setPlayer(player);
    }
  };

  if (!SpotifyApiController.isLoggedIn()) {
    window.location.href = config.homePageURL;
  }

  if (!trackRequestSent) {
    setTrackRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/tracks/${id}`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setTrackObj(res.data);
    });
  }

  if (!playerAttemptedToBeSet) {
    setPlayerAttemptedToBeSet(true);

    interval = setInterval(() => {
      initializePlayer(
        "Test",
        sessionStorage.getItem("musicInfoSpotifyAccessToken")
      );
    }, 500);
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
          name={trackObj ? trackObj.name : null}
          artists={trackObj ? trackObj.artists : null}
          trackAlbum={trackObj ? trackObj.album : null}
          images={trackObj ? trackObj.album.images : null}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TrackAlbum track={trackObj} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AlbumArtist album={trackObj ? trackObj : null} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TrackGeneralInfo track={trackObj} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AudioFeatures track={trackObj} />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AudioAnalysis
          track={trackObj}
          player={player}
          playerReady={playerReady}
        />
      </Grid>
    </Grid>
  );
}
