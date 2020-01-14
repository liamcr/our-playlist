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

export default function ArtistAlbums(props) {
  const classes = useStyles();

  const [albums, setAlbums] = useState(null);
  const [albumRequestSent, setAlbumRequestSent] = useState(false);

  const buildString = stringArr => {
    return stringArr.slice(1).reduce((prevString, nextString) => {
      return `${prevString},${nextString}`;
    }, stringArr[0]);
  };

  if (!albumRequestSent && props !== null) {
    setAlbumRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/artists/${props.id}/albums?include_groups=album&country=from_token`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      let albumIds = res.data.items.map(album => album.id);

      SpotifyApiController.apiRequest(
        "GET",
        `https://api.spotify.com/v1/albums?ids=${encodeURIComponent(
          buildString(albumIds)
        )}`,
        sessionStorage.getItem("musicInfoSpotifyAccessToken"),
        {}
      ).then(res => {
        setAlbums(res.data.albums);
      });
    });
  }

  if (props === null || albums === null) {
    return (
      <Card className={classes.cardContainer}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          Albums
        </Typography>
        <CircularProgress />
      </Card>
    );
  }
  return (
    <Card>
      <PreviewList limit={1000} data={albums} title="Albums" dataType="album" />
    </Card>
  );
}
