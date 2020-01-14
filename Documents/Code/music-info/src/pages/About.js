import React from "react";
import { Card, Typography, Button, Box, makeStyles } from "@material-ui/core";
import { config } from "../config";

const useStyles = makeStyles({
  container: {
    margin: 36,
    padding: "48px 48px 0 48px"
  },
  section: {
    margin: "24px 0"
  }
});

export default function About() {
  const classes = useStyles();

  return (
    <Card className={classes.container}>
      <Typography variant="h4" gutterBottom>
        About Musipedia
      </Typography>
      <Typography variant="body1" gutterBottom>
        Musipedia is a site that gives Spotify users access to any track,
        artist, or album available in the Spotify library. Due to the use of
        Spotify's web API, a valid Spotify account is required to use this
        application.
      </Typography>
      <Box className={classes.section}>
        <Typography variant="h5" gutterBottom>
          Artists
        </Typography>
        <Typography variant="body1" gutterBottom>
          An artist page will give you information about, as you can probably
          guess, an artist. You will be able to explore their top tracks,
          discography, and bits of general information about them, such as how
          many Spotify followers they have, how popular they are, and what
          genres they're associated with. Click the button below to be taken to
          an artist's page!
        </Typography>
        <Button
          color="primary"
          href={`${config.homePageURL}/artist/6eUKZXaKkcviH0Ku9w2n3V`}
        >
          Artist Page
        </Button>
      </Box>
      <Box className={classes.section}>
        <Typography variant="h5" gutterBottom>
          Albums
        </Typography>
        <Typography variant="body1" gutterBottom>
          The album page allows you to explore an album's artist, the track
          list, and some general bits of relevant information, such as the
          number of tracks, the duration, and the release date. Click the button
          below to be taken to an album's page!
        </Typography>
        <Button
          color="primary"
          href={`${config.homePageURL}/album/4LH4d3cOWNNsVw41Gqt2kv`}
        >
          Album Page
        </Button>
      </Box>
      <Box className={classes.section}>
        <Typography variant="h5" gutterBottom>
          Tracks
        </Typography>
        <Typography variant="body1" gutterBottom>
          The track page gives you the ability to explore a track's album, it's
          artist, and general bits of information including a track's duration,
          it's popularity, and it's release date. Audio features are also made
          available, such as the track's key, tempo, and loudness. Spotify's
          audio analysis abilities are also used to split a track up into
          sections (ex. verse, chorus, etc.). You have the ability to listen to
          each section of the track, as well as find information about it, such
          as key, tempo, and loudness.
        </Typography>
        <Button
          color="primary"
          href={`${config.homePageURL}/track/7oK9VyNzrYvRFo7nQEYkWN`}
        >
          Track Page
        </Button>
      </Box>
    </Card>
  );
}
