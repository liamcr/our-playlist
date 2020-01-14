import React, { useState } from "react";
import {
  IconButton,
  Paper,
  InputBase,
  makeStyles,
  Tooltip
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { config } from "../config";

const useStyles = makeStyles({
  searchBarMain: {
    display: "inline-flex",
    paddingRight: "1%",
    width: "50%"
  },
  searchBarAppBar: {
    display: "inline-flex",
    paddingRight: "1%",
    maxWidth: "25%"
  }
});

export default function SearchBar(props) {
  const classes = useStyles();
  const [query, setQuery] = useState(props.query ? props.query : "");

  return (
    <Paper
      className={props.main ? classes.searchBarMain : classes.searchBarAppBar}
    >
      <Tooltip title="Search">
        <IconButton
          href={`${config.homePageURL}/search/${encodeURIComponent(query)}`}
          disabled={query === ""}
          aria-label="Search"
        >
          <Search />
        </IconButton>
      </Tooltip>

      <InputBase
        value={query}
        onChange={e => {
          setQuery(e.target.value);
        }}
        placeholder="Search"
        fullWidth
        onKeyDown={e => {
          if (e.keyCode === 13 && query !== "") {
            e.preventDefault();

            window.location.href = `${
              config.homePageURL
            }/search/${encodeURIComponent(query)}`;
          }
        }}
      />
    </Paper>
  );
}
