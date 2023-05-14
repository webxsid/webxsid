import { SpotifyActionTypes } from "@store/types";

export interface ISpotifyState {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface ISpotifyAction {
  type: SpotifyActionTypes;
  payload: ISpotifyState;
}
