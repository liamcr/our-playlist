import React, { useState } from "react";
import PreviewList from "./PreviewList";
import {
  Card,
  Typography,
  CircularProgress,
  makeStyles
} from "@material-ui/core";
import SpotifyApiController from "./SpotifyApiController";

let useStyles = makeStyles(theme => ({
  cardContainer: {
    padding: 5
  }
}));

export default function ArtistTopTracks(props) {
  const classes = useStyles();

  const [tracks, setTracks] = useState(null);
  const [trackRequestSent, setTrackRequestSent] = useState(false);

  const buildString = stringArr => {
    return stringArr.slice(1).reduce((prevString, nextString) => {
      return `${prevString},${nextString}`;
    }, stringArr[0]);
  };

  if (!trackRequestSent && props.album !== null) {
    setTrackRequestSent(true);

    let trackIds = props.album.tracks.items.map(track => track.id);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/tracks?ids=${encodeURIComponent(
        buildString(trackIds)
      )}`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setTracks(res.data.tracks);
    });
  }

  if (props.album === null) {
    return (
      <Card className={classes.cardContainer}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          Tracks
        </Typography>
        <CircularProgress />
      </Card>
    );
  }
  return (
    <Card>
      <PreviewList limit={50} data={tracks} title="Tracks" dataType="track" />
    </Card>
  );
}
