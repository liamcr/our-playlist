import React, { useState, useEffect } from "react";
import { IconButton, LinearProgress, makeStyles } from "@material-ui/core";
import { PlayArrow, Pause } from "@material-ui/icons";
import SpotifyApiController from "./SpotifyApiController";

const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center"
  },
  progressBar: {
    width: "100%",
    marginRight: 12,
    borderRadius: 1000
  }
});

export default function Player(props) {
  const classes = useStyles();

  const [songPosition, setSongPosition] = useState(props.section.start);
  const [paused, setPaused] = useState(true);

  let checkPositionInterval = null;

  useEffect(() => {
    if (
      songPosition < props.section.start ||
      songPosition > props.section.start + props.section.duration
    ) {
      if (!paused) {
        handlePause();
      }
      return;
    }
    const id = setInterval(() => {
      if (props.player !== null) {
        props.player.getCurrentState().then(state => {
          if (!state) {
            return;
          }
          let { position, playerPaused } = state;

          if (
            position / 1000 > props.section.start + props.section.duration ||
            position / 1000 < props.section.start
          ) {
            setPaused(true);
            setSongPosition(props.section.start);
          } else if (
            position / 1000 < props.section.start + props.section.duration &&
            position / 1000 > props.section.start &&
            paused &&
            !playerPaused
          ) {
            handlePause();
          } else {
            setSongPosition(position / 1000);
          }
        });
      }
    }, 100);
    return () => clearInterval(id);
  });

  const handlePause = () => {
    if (props.playerReady) {
      setPaused(true);
      clearInterval(checkPositionInterval);
      props.player.pause();
    }
  };

  const checkSongPosition = () => {
    if (songPosition > props.section.start + props.section.duration) {
      handlePause();
      clearInterval(checkPositionInterval);
    }
  };

  const handlePlay = () => {
    if (props.playerReady) {
      SpotifyApiController.apiRequest(
        "PUT",
        `https://api.spotify.com/v1/me/player/play?device_id=${props.player._options.id}`,
        sessionStorage.getItem("musicInfoSpotifyAccessToken"),
        {
          uris: [props.uri],
          position_ms: props.section.start * 1000
        }
      ).then(() => {
        setSongPosition(props.section.start);
        setPaused(false);

        checkPositionInterval = setInterval(() => checkSongPosition(), 200);
      });
    }
  };

  return (
    <div className={classes.container}>
      {paused ? (
        <IconButton color="primary" onClick={handlePlay}>
          <PlayArrow />
        </IconButton>
      ) : (
        <IconButton color="primary" onClick={handlePause}>
          <Pause />
        </IconButton>
      )}
      <LinearProgress
        variant="determinate"
        className={classes.progressBar}
        value={
          ((songPosition - props.section.start) * 100) / props.section.duration
        }
      />
    </div>
  );
}
