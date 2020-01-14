import React from "react";
import { Typography, Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  container: {
    textAlign: "center",
    margin: "24px auto"
  }
});

export default function PageNotFound() {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h2" color="textSecondary">
        Page not found
      </Typography>
    </Box>
  );
}
