import React from "react";
import {
  Card,
  Typography,
  makeStyles,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Divider
} from "@material-ui/core";

let useStyles = makeStyles(theme => ({
  cardContainer: {
    padding: 5
  },
  cardTitle: {
    padding: "16px 0 0 16px"
  }
}));

export default function TrackGeneralInfo(props) {
  const classes = useStyles();

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

  if (props.track === null) {
    return (
      <Card className={classes.cardContainer}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          Genral Info
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
          Genral Info
        </Typography>
        <List>
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Duration</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {buildDurationString(props.track.duration_ms)}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Explicit</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {props.track.explicit ? "Yes" : "No"}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Popularity</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {props.track.popularity}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Release Date</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {props.track.album.release_date}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Markets</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {props.track.available_markets.length}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Card>
    );
  }
}
