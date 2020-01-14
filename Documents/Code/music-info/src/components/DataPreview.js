import React, { useState } from "react";
import clsx from "clsx";
import {
  Box,
  Card,
  CardActions,
  CardMedia,
  Typography,
  makeStyles,
  IconButton,
  Collapse,
  CardContent,
  Grid,
  Button,
  Icon,
  Tooltip
} from "@material-ui/core";
import { AccountCircle, ExpandMore } from "@material-ui/icons";
import { config } from "../config";

const useStyles = makeStyles(theme => ({
  card: {
    lineHeight: 0,
    borderRadius: 0,
    width: "100%"
  },
  cardOpen: {
    height: "auto"
  },
  preliminaryInfo: {
    display: "inline-flex",
    width: "100%"
  },
  cardContent: {
    "&:last-child": {
      paddingBottom: "16px"
    }
  },
  dataImage: {
    height: "10vh",
    minHeight: "100px",
    width: "10vh",
    minWidth: "100px"
  },
  details: {
    margin: "auto 10px",
    flex: 1,
    overflowX: "auto"
  },
  collapsedDataEntry: {
    width: "50%",
    display: "inline-block"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  moreInfoButton: {
    position: "relative",
    right: 0
  }
}));

export default function DataPreview(props) {
  let data;
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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

  // Converts and array of strings to a comma-separated string
  const buildString = stringArr => {
    return stringArr.slice(1).reduce((prevString, nextString) => {
      return `${prevString}, ${nextString}`;
    }, stringArr[0]);
  };

  // Builds a row of data entries found in the collapsed section
  // of the card
  const buildGridRow = dataArr => {
    return dataArr.map((entry, index) => (
      <Box className={classes.collapsedDataEntry} key={index}>
        <Typography noWrap variant="subtitle1" display="inline">
          {`${entry[0]} `}
        </Typography>
        <Typography
          noWrap
          variant="subtitle1"
          display="inline"
          color="textSecondary"
        >
          {entry[1]}
        </Typography>
      </Box>
    ));
  };

  if (props.dataType === "track") {
    data = {
      id: props.data.id,
      heading: props.data.name,
      firstSubtitle: props.data.album.name,
      secondSubtitle: buildString(
        props.data.artists.map(artist => artist.name)
      ),
      dataImageUrl: props.data.album.images[0].url,
      collapsedData: {
        Duration: buildDurationString(props.data.duration_ms),
        Explicit: props.data.explicit ? "Yes" : "No",
        Popularity: props.data.popularity
      }
    };
  } else if (props.dataType === "artist") {
    data = {
      id: props.data.id,
      heading: props.data.name,
      dataImageUrl:
        props.data.images.length > 0 ? props.data.images[0].url : null,
      collapsedData: {
        Followers: props.data.followers.total.toLocaleString(),
        Popularity: props.data.popularity
      }
    };
  } else if (props.dataType === "album") {
    data = {
      id: props.data.id,
      heading: props.data.name,
      firstSubtitle: buildString(props.data.artists.map(artist => artist.name)),
      dataImageUrl: props.data.images[0].url,
      collapsedData: {
        Duration: buildDurationString(
          props.data.tracks.items.reduce(
            (totalDur, nextSong) => totalDur + nextSong.duration_ms,
            0
          )
        ),
        Tracks: props.data.total_tracks,
        Popularity: props.data.popularity,
        Year: props.data.release_date.slice(0, 4)
      }
    };
  }

  let collapsedDataArr = Object.entries(data.collapsedData);

  return (
    <Card
      className={clsx(classes.card, {
        [classes.cardOpen]: expanded
      })}
      elevation={0}
    >
      <Box className={classes.preliminaryInfo}>
        {data.dataImageUrl !== null ? (
          <CardMedia
            className={classes.dataImage}
            image={data.dataImageUrl}
            title={props.dataType === "artist" ? "Artist" : "Album Art"}
          />
        ) : (
          <Icon className={classes.dataImage}>
            <AccountCircle className={classes.dataImage} />
          </Icon>
        )}

        <Box className={classes.details}>
          <Tooltip title={`${data.heading}`}>
            <Typography noWrap variant="h5">
              {`${data.heading}`}
            </Typography>
          </Tooltip>
          {data.firstSubtitle && (
            <Typography noWrap variant="body1" color="textSecondary">
              {`${data.firstSubtitle}`}
            </Typography>
          )}
          {data.secondSubtitle && (
            <Typography noWrap variant="body1" color="textSecondary">
              {`${data.secondSubtitle}`}
            </Typography>
          )}
        </Box>
        <CardActions disableSpacing>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMore />
          </IconButton>
        </CardActions>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className={classes.cardContent}>
          <Box>
            {buildGridRow(collapsedDataArr.slice(0, 2))}
            {buildGridRow(collapsedDataArr.slice(2))}
          </Box>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="flex-end"
          >
            <Button
              className={classes.moreInfoButton}
              color="primary"
              href={`${config.homePageURL}/${props.dataType}/${data.id}`}
            >
              More Info
            </Button>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}
