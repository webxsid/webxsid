import { ISpotifyState, ISpotifyAction } from "@interfaces/index";
import { SpotifyActionTypes } from "@store/types";

const initialState: ISpotifyState = {
  accessToken: "",
  refreshToken: "",
  expiresAt: "",
};

function spotifyReducer(state = initialState, action: ISpotifyAction) {
  switch (action.type) {
    case SpotifyActionTypes.SET_SPOTIFY_DATA:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export default spotifyReducer;
