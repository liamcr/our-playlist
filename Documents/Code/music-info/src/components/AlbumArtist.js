import React, { useState } from "react";
import {
  Button,
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
  artistPlaceHolder: {
    width: "100%",
    height: "100%"
  }
});

export default function AlbumArtist(props) {
  const classes = useStyles();

  const [artistObj, setArtistObj] = useState(null);
  const [artistRequestSent, setArtistRequestSent] = useState(false);

  if (!artistRequestSent && props.album !== null) {
    setArtistRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/artists/${props.album.artists[0].id}`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setArtistObj(res.data);
    });
  }

  if (artistObj === null) {
    return (
      <Card>
        <CircularProgress />
      </Card>
    );
  } else {
    return (
      <Card>
        {artistObj.images.length > 0 ? (
          <CardMedia
            className={classes.artistImage}
            image={artistObj.images[0].url}
            title="Artist"
          />
        ) : (
          <Icon className={classes.artistPlaceHolder}>
            <AccountCircle className={classes.artistPlaceHolder} />
          </Icon>
        )}
        <CardContent>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Artist
          </Typography>
          <Typography variant="h5">{artistObj.name}</Typography>
        </CardContent>
        <CardActions>
          <Button
            href={`${config.homePageURL}/artist/${artistObj.id}`}
            color="primary"
          >
            More Info
          </Button>
        </CardActions>
      </Card>
    );
  }
}
