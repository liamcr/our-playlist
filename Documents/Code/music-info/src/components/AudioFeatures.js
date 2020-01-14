import React, { useState } from "react";
import {
  Card,
  Typography,
  makeStyles,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Divider,
  IconButton,
  Popover
} from "@material-ui/core";
import SpotifyApiController from "./SpotifyApiController";
import { Info } from "@material-ui/icons";

let useStyles = makeStyles(theme => ({
  cardContainer: {
    padding: 5
  },
  cardTitle: {
    padding: "16px 0 0 16px"
  },
  dataWithInfo: {
    display: "flex"
  },
  typography: {
    padding: theme.spacing(2)
  },
  icon: {
    marginLeft: "5%"
  },
  popover: {
    maxWidth: "30%"
  }
}));

export default function AudioFeatures(props) {
  const classes = useStyles();

  const [audioFeatures, setAudioFeatures] = useState(null);
  const [featuresRequestSent, setFeaturesRequestSet] = useState(false);
  const [infoRequested, setInfoRequested] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event, infoRequested) => {
    setInfoRequested(infoRequested);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setInfoRequested("");
    setAnchorEl(null);
  };

  const content = {
    Acousticness:
      "A confidence measure from 0 to 100 of whether the track is acoustic. 100 represents high confidence the track is acoustic.",
    Danceability:
      "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0 is least danceable and 100 is most danceable.",
    Energy:
      "Energy is a measure from 0 to 100 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
    Instrumentalness:
      "Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. The closer the instrumentalness value is to 100, the greater likelihood the track contains no vocal content. Values above 50 are intended to represent instrumental tracks, but confidence is higher as the value approaches 100.",
    Liveness:
      "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 80 provides strong likelihood that the track is live.",
    Speechiness:
      "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 100 the attribute value. Values above 66 describe tracks that are probably made entirely of spoken words. Values between 33 and 66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 33 most likely represent music and other non-speech-like tracks.",
    Happiness:
      "A measure from 0 to 100 describing the musical positiveness conveyed by a track. Tracks with high happiness sound more positive (e.g. cheerful, euphoric), while tracks with low happiness sound more negative (e.g. sad, depressed, angry)."
  };

  const tonalPitchCounterparts = [
    "C",
    "D♭",
    "D",
    "E♭",
    "E",
    "F",
    "G♭",
    "G",
    "A♭",
    "A",
    "B♭",
    "B"
  ];

  const mode = ["Minor", "Major"];

  if (!featuresRequestSent && props.track !== null) {
    setFeaturesRequestSet(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/audio-features/${props.track.id}`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setAudioFeatures(res.data);
    });
  }

  if (props.track === null || audioFeatures === null) {
    return (
      <Card className={classes.cardContainer}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          Audio Features
        </Typography>
        <CircularProgress />
      </Card>
    );
  } else {
    return (
      <Card className={classes.cardContainer}>
        <Typography
          variant="h5"
          gutterBottom
          color="textSecondary"
          className={classes.cardTitle}
        >
          Audio Features
        </Typography>
        <List>
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Key</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {`${tonalPitchCounterparts[audioFeatures.key]} ${
                    mode[audioFeatures.mode]
                  }`}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Time Signature</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {audioFeatures.time_signature}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item className={classes.dataWithInfo}>
                <Typography variant="h5">Acousticness</Typography>
                <IconButton
                  className={classes.icon}
                  onClick={e => handleOpen(e, "Acousticness")}
                  size="small"
                >
                  <Info />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {Math.round(audioFeatures.acousticness * 100)}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item className={classes.dataWithInfo}>
                <Typography variant="h5">Danceability</Typography>
                <IconButton
                  onClick={e => handleOpen(e, "Danceability")}
                  size="small"
                  className={classes.icon}
                >
                  <Info />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {Math.round(audioFeatures.danceability * 100)}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item className={classes.dataWithInfo}>
                <Typography variant="h5">Energy</Typography>
                <IconButton
                  className={classes.icon}
                  onClick={e => handleOpen(e, "Energy")}
                  size="small"
                >
                  <Info />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {Math.round(audioFeatures.energy * 100)}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item className={classes.dataWithInfo}>
                <Typography variant="h5">Instrumentalness</Typography>
                <IconButton
                  className={classes.icon}
                  onClick={e => handleOpen(e, "Instrumentalness")}
                  size="small"
                >
                  <Info />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {Math.round(audioFeatures.instrumentalness * 100)}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item className={classes.dataWithInfo}>
                <Typography variant="h5">Liveness</Typography>
                <IconButton
                  className={classes.icon}
                  onClick={e => handleOpen(e, "Liveness")}
                  size="small"
                >
                  <Info />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {Math.round(audioFeatures.liveness * 100)}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Loudness</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {`${Math.round(audioFeatures.loudness)} dB`}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item className={classes.dataWithInfo}>
                <Typography variant="h5">Speechiness</Typography>
                <IconButton
                  className={classes.icon}
                  onClick={e => handleOpen(e, "Speechiness")}
                  size="small"
                >
                  <Info />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {Math.round(audioFeatures.speechiness * 100)}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item className={classes.dataWithInfo}>
                <Typography variant="h5">Happiness</Typography>
                <IconButton
                  className={classes.icon}
                  onClick={e => handleOpen(e, "Happiness")}
                  size="small"
                >
                  <Info />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {Math.round(audioFeatures.valence * 100)}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Tempo</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {`${Math.round(audioFeatures.tempo)} BPM`}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
        </List>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          classes={{ paper: classes.popover }}
        >
          <Typography className={classes.typography} variant="h4">
            {infoRequested}
          </Typography>
          <Typography className={classes.typography} variant="body1">
            {content[infoRequested]}
          </Typography>
        </Popover>
      </Card>
    );
  }
}
