import { ISpotifyAction, ISpotifyState } from "@interfaces/index";
import { SpotifyActionTypes } from "@store/types";

export const setSpotifyData = (payload: ISpotifyState): ISpotifyAction => ({
  type: SpotifyActionTypes.SET_SPOTIFY_DATA,
  payload,
});
