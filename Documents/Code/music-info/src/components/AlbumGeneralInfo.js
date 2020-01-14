import React from "react";
import {
  Box,
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
    padding: 5,
    paddingBottom: 16
  },
  cardTitle: {
    padding: "16px 0 0 16px"
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  nestedItem: {
    padding: 0
  }
}));

export default function AlbumGeneralInfo(props) {
  const classes = useStyles();

  // Converts a time interval in milliseconds to the format
  // minutes:seconds
  const buildDurationString = durationMs => {
    const durationInSeconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(durationInSeconds / (60 * 60));
    const minutes = Math.floor(durationInSeconds / 60) % 60;
    const seconds = durationInSeconds - 60 * minutes - 60 * 60 * hours;

    return `${hours > 0 ? `${hours}:` : ""}${
      hours > 0 ? ("0" + minutes).slice(-2) : minutes
    }:${("0" + seconds).slice(-2)}`;
  };

  if (props.album === null) {
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
                <Typography variant="h5">Tracks</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {props.album.total_tracks}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Duration</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" color="textSecondary">
                  {buildDurationString(
                    props.album.tracks.items
                      .map(track => track.duration_ms)
                      .reduce(
                        (cumulativeVal, nextVal) => cumulativeVal + nextVal,
                        0
                      )
                  )}
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
                  {props.album.popularity}
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
                  {props.album.release_date}
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
                  {props.album.available_markets.length}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
          <Divider />
          <ListItem>
            <Grid container justify="space-between">
              <Grid item>
                <Typography variant="h5">Genres:</Typography>
              </Grid>
            </Grid>
          </ListItem>
        </List>
        <List disablePadding className={classes.nested}>
          {props.album.genres.length > 0 ? (
            <Box>
              <ListItem disableGutters className={classes.nestedItem}>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h5" color="textSecondary">
                      {props.album.genres[0]}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </Box>
          ) : (
            <ListItem disableGutters className={classes.nestedItem}>
              <Grid container justify="space-between">
                <Grid item>
                  <Typography variant="h5" gutterBottom color="textSecondary">
                    No Genres Found
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
          )}
          {props.album.genres.slice(1).map((genre, index) => (
            <Box key={index}>
              <Divider />
              <ListItem disableGutters className={classes.nestedItem}>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h5" gutterBottom color="textSecondary">
                      {genre}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </Box>
          ))}
        </List>
      </Card>
    );
  }
}
