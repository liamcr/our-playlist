import React from "react";
import axios from "axios";
import { config } from "../config";

export default class SpotifyApiController extends React.Component {
  /*
   * Params: requestType - String (GET, POST, etc..)
   *         endpoint - String
   *         accessToken - String
   *         data - Object
   * Returns: apiResponse - Object
   * Desc: More readable api request method.
   */
  static apiRequest = async (requestType, endpoint, accessToken, data) => {
    const requestResponse = await axios({
      method: requestType,
      url: endpoint,
      data: Object.entries(data).length === 0 ? {} : JSON.stringify(data),
      headers: {
        Authorization: "Bearer " + accessToken
      }
    });

    return requestResponse;
  };

  /*
   * Params: none
   * Returns: authURI - String
   * Desc: Builds the URL to which the user should be redirected to log
   * into Spotify.
   */
  static buildAuthenticationURI = () => {
    let authURI = `https://accounts.spotify.com/authorize?client_id=${config.clientID}`;

    authURI = authURI.concat(
      `&redirect_uri=${encodeURIComponent(config.redirectURI)}`
    );
    authURI = authURI.concat(
      `&scope=${encodeURIComponent(config.scopes.join(" "))}`
    );
    authURI = authURI.concat("&response_type=token");

    return authURI;
  };

  /*
   * Params: none
   * Returns: Boolean
   * Desc: Determines whether or not the user's previously received Spotify
   * access token is expired.
   */
  static isTokenExpired = () => {
    let currentTimeStamp = Math.floor(Date.now() / 1000);
    let authExpiry = sessionStorage.getItem("musicInfoTokenExpiration");

    if (authExpiry !== null) {
      if (currentTimeStamp < parseInt(authExpiry)) {
        return false;
      }
    }

    return true;
  };

  /*
   * Params: none
   * Returns: Boolean
   * Desc: Determines whether or not the user has previously logged into Spotify
   * for use with this app, as well as if that authentication is still valid
   * (i.e. not expired)
   */
  static isLoggedIn = () => {
    let authToken = sessionStorage.getItem("musicInfoSpotifyAccessToken");

    if (authToken === null) {
      return false;
    } else {
      return !this.isTokenExpired();
    }
  };

  /*
   * Params: none
   * Returns: Object
   * Desc: Converts the hash in the url from something like:
   *     "#access_token=abc&token_type=Bearer&expires_in=3600"
   * to something like:
   *     {
   *         access_token: "abc",
   *         token_type: "Bearer",
   *         expires_in: "3600"
   *     }
   */
  static parseURLHash = () => {
    let hash = window.location.hash.substring(1);
    let jsonHash = `{"${hash.replace(/&/g, '","').replace(/=/g, '":"')}"}`;

    return hash ? JSON.parse(jsonHash) : {};
  };

  /*
   * Params: none
   * Returns: Void
   * Desc: Handles the logic behind authenticating the user with Spotify. The user's
   * Spotify authentication token will be updated if a new one has been requested, and
   * the user will be redirected to the "Get Started" page if their token is either
   * non-existant or expired.
   */
  static handleLogin = () => {
    if (window.location.search === "?error=access_denied") {
      // If the user has not given permission to use their account,
      // redirect them back to the "Get Started" page
      window.location.href = config.homePageURL;
    }

    let hashData = this.parseURLHash();

    if (hashData.hasOwnProperty("access_token")) {
      let currentTimeStamp = Math.floor(Date.now() / 1000);

      if (
        hashData["access_token"] !==
        sessionStorage.getItem("musicInfoSpotifyAccessToken")
      ) {
        let expirationTime =
          currentTimeStamp + parseInt(hashData["expires_in"]);

        sessionStorage.setItem(
          "musicInfoSpotifyAccessToken",
          hashData["access_token"]
        );
        sessionStorage.setItem(
          "musicInfoTokenExpiration",
          expirationTime.toString()
        );
      } else {
        if (this.isTokenExpired()) {
          window.location.href = config.homePageURL;
        }
      }
    } else {
      if (sessionStorage.getItem("musicInfoSpotifyAccessToken") === null) {
        window.location.href = config.homePageURL;
      } else if (this.isTokenExpired()) {
        window.location.href = config.homePageURL;
      }
    }
  };
}
