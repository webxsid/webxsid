import React, { useEffect } from "react";
import { startSpotifyAuth } from "@functions/spotify.functions";

const SpotifyLogin = () => {
  useEffect(() => {
    startSpotifyAuth();
  }, []);
  return <div>SpotifyLogin</div>;
};

export default SpotifyLogin;
