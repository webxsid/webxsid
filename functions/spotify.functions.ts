import axios from "axios";
import { config } from "@config/index";
import generateRandomString from "@/utils/generateRandomString";

export const startSpotifyAuth = async () => {
  const scopes =
    "user-read-private user-read-email user-read-currently-playing user-read-recently-played";
  const { spotifyClientId, spotifyRedirectUri } = config;
  const state = generateRandomString(16);
  // prettier-ignore
  window.open(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyClientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(spotifyRedirectUri)}&state=${state}`,
    "_self"
  );
};

export const regenerateSpotifyToken = async (refreshToken: string) => {
  const { spotifyClientId, spotifyClientSecret } = config;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${spotifyClientId}:${spotifyClientSecret}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  const data = await axios.post(authOptions.url, authOptions.form, {
    headers: authOptions.headers,
  });
  return data.data;
};

export const getPlaybackState = async (accessToken: string) => {
  const authOptions = {
    url: "https://api.spotify.com/v1/me/player/currently-playing",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    json: true,
  };

  const data = await axios.get(authOptions.url, {
    headers: authOptions.headers,
  });

  if (!data.data) {
    return await getRecentlyPlayed(accessToken);
  }

  const { item, is_playing } = data.data;
  console.log(data);
  const { album, name: trackName, external_urls } = item;
  const { images, name: albumName, external_urls: albumUrls } = album;
  const trackUrl = external_urls.spotify;
  const albumUrl = albumUrls.spotify;
  return {
    albumName,
    albumUrl,
    trackName,
    trackUrl,
    isPlaying: is_playing,
    albumImage: images?.at(-1)?.url,
  };
};

export const getRecentlyPlayed = async (accessToken: string) => {
  const authOptions = {
    url: "https://api.spotify.com/v1/me/player/recently-played",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    json: true,
  };

  const data = await axios.get(authOptions.url, {
    headers: authOptions.headers,
  });

  const { items } = data.data;
  const { album, name: trackName, external_urls } = items[0].track;
  const { images, name: albumName, external_urls: albumUrls } = album;
  const trackUrl = external_urls.spotify;
  const albumUrl = albumUrls.spotify;
  return {
    albumName,
    albumUrl,
    trackName,
    trackUrl,
    isPlaying: false,
    albumImage: images?.at(-1)?.url,
  };
};

export const saveRefreshToken = async (refreshToken: string) => {
  const authOptions = {
    url: "/api/spotify/data",
    method: "POST",
    data: {
      refreshToken,
    },
    json: true,
  };

  const data = await axios.post(authOptions.url, authOptions.data);
  return data.data;
};

export const getRefreshToken = async () => {
  const authOptions = {
    url: `${config.server_url}/api/spotify`,
    method: "GET",
    json: true,
  };

  const data = await axios.get(authOptions.url);
  return data.data;
};
