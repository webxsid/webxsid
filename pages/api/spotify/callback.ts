import { config } from "@config/index";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;
  const { spotifyClientId, spotifyClientSecret, spotifyRedirectUri } = config;

  if (req.method !== "GET") {
    res.status(405).end(
      JSON.stringify({
        message: "Method not allowed",
      })
    );
  }
  if (!code) {
    res.status(400).end(
      JSON.stringify({
        message: "Missing code",
      })
    );
  }
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code,
      redirect_uri: spotifyRedirectUri,
      grant_type: "authorization_code",
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
  console.log(data.data);
  const { access_token, refresh_token } = data.data;

  res.redirect(
    "/spotify/callback?access_token=" +
      access_token +
      "&refresh_token=" +
      refresh_token
  );
};

export default callback;
