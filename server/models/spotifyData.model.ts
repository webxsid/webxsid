import mongoose from "mongoose";
import { ISpotifyData } from "@server/interfaces";

const spotifyDataSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  },
});

const SpotifyData =
  mongoose.models["SpotifyData"] ||
  mongoose.model<ISpotifyData>("SpotifyData", spotifyDataSchema);

export default SpotifyData;
