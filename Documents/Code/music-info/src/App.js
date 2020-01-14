import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import GetStarted from "./pages/GetStarted";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import Track from "./pages/Track";
import Artist from "./pages/Artist";
import Album from "./pages/Album";
import SearchPage from "./pages/SearchPage";
import About from "./pages/About";
import {
  Box,
  createMuiTheme,
  CssBaseline,
  IconButton,
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Tooltip
} from "@material-ui/core";
import { Brightness4, Brightness7, ExitToApp, Info } from "@material-ui/icons";
import "./App.css";
import SearchBar from "./components/SearchBar";
import { config } from "./config";

const useStyles = makeStyles({
  titleBox: {
    flex: 1
  },
  titleText: {
    display: "inline-flex",
    marginRight: "2%",
    cursor: "pointer"
  }
});

// Determines whether or not the search bar should appear within the app bar
function showSearchBar() {
  let parsedPath = window.location.pathname.split("/");
  let pathname;

  if (parsedPath.length === 0) {
    pathname = "/";
  } else {
    pathname = `/${parsedPath[1]}`;
  }

  return !["/", "/page-not-found", "/home", "/search"].includes(pathname);
}

// Determines whether or not the logout button should appear within the app bar
function showLogout() {
  let parsedPath = window.location.pathname.split("/");
  let pathname;

  if (parsedPath.length === 0) {
    pathname = "/";
  } else {
    pathname = `/${parsedPath[1]}`;
  }

  return !["/", "/page-not-found"].includes(pathname);
}

function App() {
  const classes = useStyles();
  const [themeSetting, setThemeSetting] = useState(
    localStorage.getItem("musicInfoTheme") !== null
      ? localStorage.getItem("musicInfoTheme")
      : "light"
  );

  // Theme and Palette configuration
  const theme = createMuiTheme({
    palette: {
      type: themeSetting,
      primary: {
        main: "#C71585"
      }
    }
  });

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = config.homePageURL;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Box className={classes.titleBox}>
            <Typography
              variant="h4"
              className={classes.titleText}
              onClick={() => {
                if (
                  window.location.pathname !== "/" &&
                  window.location.pathname !== "/page-not-found"
                ) {
                  window.location.href = `${config.homePageURL}/home`;
                } else {
                  window.location.href = config.homePageURL;
                }
              }}
            >
              Musipedia
            </Typography>
            {showSearchBar() && <SearchBar />}
          </Box>
          <Tooltip title="About">
            <IconButton
              edge="end"
              color="inherit"
              aria-label="About"
              onClick={() => {
                window.location.href = `${config.homePageURL}/about`;
              }}
            >
              <Info />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle light/dark theme">
            <IconButton
              edge="end"
              color="inherit"
              aria-label="Toggle light/dark theme"
              onClick={() => {
                if (themeSetting === "light") {
                  localStorage.setItem("musicInfoTheme", "dark");
                  setThemeSetting("dark");
                } else {
                  localStorage.setItem("musicInfoTheme", "light");
                  setThemeSetting("light");
                }
              }}
            >
              {themeSetting === "light" ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
          </Tooltip>
          {showLogout() && (
            <Tooltip title="Log out">
              <IconButton
                edge="end"
                color="inherit"
                aria-label="Log out"
                onClick={() => {
                  handleLogout();
                }}
              >
                <ExitToApp />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <GetStarted />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/track/:id">
            <Track />
          </Route>
          <Route path="/album/:id">
            <Album />
          </Route>
          <Route path="/artist/:id">
            <Artist />
          </Route>
          <Route path="/search/:query">
            <SearchPage />
          </Route>
          <Route path="/page-not-found">
            <PageNotFound />
          </Route>
          <Redirect from="*" to="/page-not-found" />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
