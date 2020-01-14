import React, { useState } from "react";
import clsx from "clsx";
import {
  Box,
  Card,
  CardActions,
  Typography,
  makeStyles,
  IconButton,
  Collapse,
  CardContent
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import Player from "./Player";

const useStyles = makeStyles(theme => ({
  card: {
    lineHeight: 0,
    borderRadius: 0,
    width: "100%"
  },
  cardOpen: {
    height: "auto"
  },
  sectionTitle: {
    marginRight: 10
  },
  cardHeader: {
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

export default function SectionCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Converts a time in seconds to the format
  // hours:minutes:seconds
  const buildTimeString = durationInSeconds => {
    const hours = Math.floor(durationInSeconds / (60 * 60));
    const minutes = Math.floor(durationInSeconds / 60) % 60;
    const seconds = Math.floor(
      durationInSeconds - 60 * minutes - 60 * 60 * hours
    );

    return `${hours > 0 ? `${hours}:` : ""}${
      hours > 0 ? ("0" + minutes).slice(-2) : minutes
    }:${("0" + seconds).slice(-2)}`;
  };

  const buildIntervalString = sectionObj => {
    const endTime = sectionObj.start + sectionObj.duration;

    return `${buildTimeString(sectionObj.start)} - ${buildTimeString(endTime)}`;
  };

  return (
    <Card
      className={clsx(classes.card, {
        [classes.cardOpen]: expanded
      })}
      elevation={0}
    >
      <Box className={classes.cardHeader}>
        <Box className={classes.details}>
          <Typography
            noWrap
            display="inline"
            className={classes.sectionTitle}
            variant="h5"
          >
            {`Section ${props.index + 1}`}
          </Typography>
          <Typography
            noWrap
            variant="h5"
            display="inline"
            color="textSecondary"
          >
            {buildIntervalString(props.section)}
          </Typography>
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
      <Player
        player={props.player}
        section={props.section}
        uri={props.uri}
        playerReady={props.playerReady}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className={classes.cardContent}>
          <Box className={classes.collapsedDataEntry}>
            <Typography noWrap variant="subtitle1" display="inline">
              {`Duration `}
            </Typography>
            <Typography
              noWrap
              variant="subtitle1"
              display="inline"
              color="textSecondary"
            >
              {buildTimeString(props.section.duration)}
            </Typography>
          </Box>
          <Box className={classes.collapsedDataEntry}>
            <Typography noWrap variant="subtitle1" display="inline">
              {`Confidence `}
            </Typography>
            <Typography
              noWrap
              variant="subtitle1"
              display="inline"
              color="textSecondary"
            >
              {Math.round(props.section.confidence * 100)}
            </Typography>
          </Box>
          <Box className={classes.collapsedDataEntry}>
            <Typography noWrap variant="subtitle1" display="inline">
              {`Loudness `}
            </Typography>
            <Typography
              noWrap
              variant="subtitle1"
              display="inline"
              color="textSecondary"
            >
              {`${Math.round(props.section.loudness)} dB`}
            </Typography>
          </Box>
          <Box className={classes.collapsedDataEntry}>
            <Typography noWrap variant="subtitle1" display="inline">
              {`Tempo `}
            </Typography>
            <Typography
              noWrap
              variant="subtitle1"
              display="inline"
              color="textSecondary"
            >
              {`${Math.round(props.section.tempo)} BPM`}
            </Typography>
          </Box>
          <Box className={classes.collapsedDataEntry}>
            <Typography noWrap variant="subtitle1" display="inline">
              {`Key `}
            </Typography>
            <Typography
              noWrap
              variant="subtitle1"
              display="inline"
              color="textSecondary"
            >
              {`${tonalPitchCounterparts[props.section.key]} ${
                mode[props.section.mode]
              }`}
            </Typography>
          </Box>
          <Box className={classes.collapsedDataEntry}>
            <Typography noWrap variant="subtitle1" display="inline">
              {`Time Signature `}
            </Typography>
            <Typography
              noWrap
              variant="subtitle1"
              display="inline"
              color="textSecondary"
            >
              {props.section.time_signature}
            </Typography>
          </Box>
        </CardContent>
      </Collapse>
    </Card>

    // <Card
    //   className={clsx(classes.card, {
    //     [classes.cardOpen]: expanded
    //   })}
    //   elevation={0}
    // >
    //   <Box className={classes.preliminaryInfo}>
    //     {data.dataImageUrl !== null ? (
    //       <CardMedia
    //         className={classes.dataImage}
    //         image={data.dataImageUrl}
    //         title={props.dataType === "artist" ? "Artist" : "Album Art"}
    //       />
    //     ) : (
    //       <Icon className={classes.dataImage}>
    //         <AccountCircle className={classes.dataImage} />
    //       </Icon>
    //     )}

    //     <Box className={classes.details}>
    //       <Tooltip title={`${data.heading}`}>
    //         <Typography noWrap variant="h5">
    //           {`${data.heading}`}
    //         </Typography>
    //       </Tooltip>
    //       {data.firstSubtitle && (
    //         <Typography noWrap variant="body1" color="textSecondary">
    //           {`${data.firstSubtitle}`}
    //         </Typography>
    //       )}
    //       {data.secondSubtitle && (
    //         <Typography noWrap variant="body1" color="textSecondary">
    //           {`${data.secondSubtitle}`}
    //         </Typography>
    //       )}
    //     </Box>
    //     <CardActions disableSpacing>
    //       <IconButton
    //         className={clsx(classes.expand, {
    //           [classes.expandOpen]: expanded
    //         })}
    //         onClick={handleExpandClick}
    //         aria-expanded={expanded}
    //         aria-label="show more"
    //       >
    //         <ExpandMore />
    //       </IconButton>
    //     </CardActions>
    //   </Box>
    //   <Collapse in={expanded} timeout="auto" unmountOnExit>
    //     <CardContent className={classes.cardContent}>
    //       <Box>
    //         {buildGridRow(collapsedDataArr.slice(0, 2))}
    //         {buildGridRow(collapsedDataArr.slice(2))}
    //       </Box>
    //       <Grid
    //         container
    //         direction="column"
    //         justify="center"
    //         alignItems="flex-end"
    //       >
    //         <Button
    //           className={classes.moreInfoButton}
    //           color="primary"
    //           href={`${config.homePageURL}/${props.dataType}/${data.id}`}
    //         >
    //           More Info
    //         </Button>
    //       </Grid>
    //     </CardContent>
    //   </Collapse>
    // </Card>
  );
}
