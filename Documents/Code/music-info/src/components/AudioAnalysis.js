import React, { useState } from "react";
import {
  Box,
  Card,
  CircularProgress,
  Typography,
  makeStyles,
  Divider,
  IconButton,
  Popover
} from "@material-ui/core";
import SectionCard from "./SectionCard";
import SpotifyApiController from "./SpotifyApiController";
import { Info } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  listNotLoaded: {
    display: "inline-block",
    width: "400px",
    height: "100px"
  },
  row: {
    display: "flex",
    alignItems: "center"
  },
  titleBox: {
    marginTop: 21,
    marginLeft: 21,
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginLeft: "3%"
  },
  typography: {
    padding: theme.spacing(2)
  },
  popover: {
    maxWidth: "30%"
  }
}));

export default function AudioAnalysis(props) {
  const classes = useStyles();

  const [sections, setSections] = useState(null);
  const [sectionRequestSent, setSectionRequestSent] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!sectionRequestSent && props.track !== null) {
    setSectionRequestSent(true);

    SpotifyApiController.apiRequest(
      "GET",
      `https://api.spotify.com/v1/audio-analysis/${props.track.id}`,
      sessionStorage.getItem("musicInfoSpotifyAccessToken"),
      {}
    ).then(res => {
      setSections(res.data.sections);
    });
  }

  return (
    <Card
      className={props.data === null ? classes.listNotLoaded : classes.list}
    >
      <Box className={classes.titleBox}>
        <Typography variant="h5" color="textSecondary">
          Audio Analysis
        </Typography>
        <IconButton className={classes.icon} onClick={handleOpen} size="small">
          <Info />
        </IconButton>
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
            Audio Analysis
          </Typography>
          <Typography className={classes.typography} variant="body1">
            Audio Analysis provides low-level audio analysis for all of the
            tracks in the Spotify catalog.
          </Typography>
          <Typography className={classes.typography} variant="body1">
            Sections are defined by large variations in rhythm or timbre, e.g.
            chorus, verse, bridge, guitar solo, etc. Each section contains its
            own descriptions of tempo, key, time signature, and loudness.
          </Typography>
        </Popover>
      </Box>
      {props.data === null || sections === null ? (
        <CircularProgress />
      ) : (
        <Box>
          {sections.length > 0 && sections[0] !== null ? (
            sections.map((section, index) => (
              <div key={index}>
                <SectionCard
                  index={index}
                  player={props.player}
                  section={section}
                  uri={props.track.uri}
                  playerReady={props.playerReady}
                />
                <Divider />
              </div>
            ))
          ) : (
            <Card elevation={0}>
              <Typography
                className={classes.title}
                variant="h5"
                gutterBottom
                color="textSecondary"
              >
                No Results Found
              </Typography>
            </Card>
          )}
        </Box>
      )}
    </Card>
  );
}
