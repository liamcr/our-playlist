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
    paddingBottom: 21
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

export default function ArtistGeneralInfo(props) {
  const classes = useStyles();

  if (props.artist === null) {
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
                <Typography variant="h5" gutterBottom>
                  Followers
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" gutterBottom color="textSecondary">
                  {props.artist.followers.total.toLocaleString()}
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
                  {props.artist.popularity}
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
          {props.artist.genres.length > 0 ? (
            <Box>
              <ListItem disableGutters className={classes.nestedItem}>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h5" color="textSecondary">
                      {props.artist.genres[0]}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </Box>
          ) : (
            <></>
          )}
          {props.artist.genres.slice(1).map((genre, index) => (
            <Box key={index}>
              <Divider />
              <ListItem disableGutters className={classes.nestedItem}>
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography variant="h5" color="textSecondary">
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
