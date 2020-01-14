import React, { useState } from "react";
import {
  Button,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Icon,
  makeStyles,
  Typography,
  CardContent,
  CardActions
} from "@material-ui/core";
import SpotifyApiController from "./SpotifyApiController";
import { AccountCircle } from "@material-ui/icons";
import { config } from "../config";

let useStyles = makeStyles({
  artistImage: {
    height: 0,
    paddingTop: "100%"
  },
  dataName: {
    marginRight: 10
  }
});

export default function TrackAlbum(props) {
  const classes = useStyles();

  const [albumObj, setAlbumObj] = useState(null);
  const [albumRequestSent, setAlbumRequestSent] = useState(false);

  // Converts a time interval in milliseconds to the format
  // hours:minutes:seconds
  const buildDurationString = durationMs => {
    const durationInSeconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(durationInSeconds / (60 * 60));
    const minutes = Math.floor(durationInSeconds / 60) % 60;
    const seconds = durationInSeconds - 60 * minutes - 60 * 60 * hours;

    return `${hours > 0 ? `${hours}:` : ""}${
      hours > 0 ? ("0" + minutes).slice(-2) : minutes
    }:${("0" + seconds).slice(-2)}`;
  };

  if (!albumRequestSent && props.track !== null) {
    setAlbumRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/albums/${props.track.album.id}`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setAlbumObj(res.data);
    });
  }

  if (albumObj === null) {
    return (
      <Card>
        <CircularProgress />
      </Card>
    );
  } else {
    return (
      <Card>
        {albumObj.images.length > 0 ? (
          <CardMedia
            className={classes.artistImage}
            image={albumObj.images[0].url}
            title="Album"
          />
        ) : (
          <Icon>
            <AccountCircle />
          </Icon>
        )}
        <CardContent>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Album
          </Typography>
          <Typography variant="h5">{albumObj.name}</Typography>
          <Box>
            <Typography
              variant="h5"
              className={classes.dataName}
              display="inline"
            >
              Duration
            </Typography>
            <Typography variant="h5" color="textSecondary" display="inline">
              {buildDurationString(
                albumObj.tracks.items
                  .map(track => track.duration_ms)
                  .reduce(
                    (cumulativeVal, nextVal) => cumulativeVal + nextVal,
                    0
                  )
              )}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h5"
              className={classes.dataName}
              display="inline"
            >
              Track Number
            </Typography>
            <Typography variant="h5" color="textSecondary" display="inline">
              {props.track.track_number}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h5"
              className={classes.dataName}
              display="inline"
            >
              Year
            </Typography>
            <Typography variant="h5" color="textSecondary" display="inline">
              {albumObj.release_date.slice(0, 4)}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button
            href={`${config.homePageURL}/album/${albumObj.id}`}
            color="primary"
          >
            More Info
          </Button>
        </CardActions>
      </Card>
    );
  }
}
