import React from "react";
import SpotifyApiController from "../components/SpotifyApiController";
import { Box, Button, Card, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    padding: 10,
    margin: "20vh auto",
    minWidth: 235,
    maxWidth: "20%"
  }
});

export default function GetStarted() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Typography variant="h3" gutterBottom>
        Welcome!
      </Typography>
      <Typography paragraph>
        To start exploring tracks, albums, and artists, log into Spotify below!
      </Typography>
      <Box textAlign="center">
        <Button
          color="primary"
          variant="contained"
          href={SpotifyApiController.buildAuthenticationURI()}
        >
          Log In
        </Button>
      </Box>
    </Card>
  );
}
