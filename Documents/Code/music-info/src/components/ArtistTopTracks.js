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

  const [topTracks, setTopTracks] = useState(null);
  const [trackRequestSent, setTrackRequestSent] = useState(false);

  if (!trackRequestSent && props !== null) {
    setTrackRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/artists/${props.id}/top-tracks?country=from_token`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setTopTracks(res.data);
    });
  }

  if (props === null || topTracks === null) {
    return (
      <Card className={classes.cardContainer}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          Top Tracks
        </Typography>
        <CircularProgress />
      </Card>
    );
  }
  return (
    <Card>
      <PreviewList
        limit={10}
        data={topTracks.tracks}
        title="Top Tracks"
        dataType="track"
      />
    </Card>
  );
}
