import { Document } from "mongoose";

export interface ISpotifyData extends Document {
  refreshToken: string;
}
