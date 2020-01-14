import React from "react";
import {
  Box,
  Card,
  CircularProgress,
  Typography,
  makeStyles
} from "@material-ui/core";
import DataPreview from "./DataPreview";

const useStyles = makeStyles({
  listNotLoaded: {
    display: "inline-block",
    width: "400px",
    height: "100px"
  },
  row: {
    display: "flex",
    alignItems: "center"
  },
  title: {
    marginTop: 16,
    marginLeft: 16
  }
});

export default function PreviewList(props) {
  const classes = useStyles();

  return (
    <Box className={props.data === null ? classes.listNotLoaded : classes.list}>
      <Typography
        variant="h5"
        gutterBottom
        color="textSecondary"
        className={props.homePage ? "" : classes.title}
      >
        {props.title}
      </Typography>
      {props.data === null ? (
        <CircularProgress />
      ) : (
        <Box>
          {props.data.length > 0 && props.data[0] !== null ? (
            props.data
              .slice(0, props.limit)
              .map((datum, index) => (
                <DataPreview
                  key={index}
                  dataType={props.dataType}
                  data={datum}
                />
              ))
          ) : (
            <Card elevation={0}>
              <Typography
                className={props.homePage ? "" : classes.title}
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
    </Box>
  );
}
