import { IThemeState } from "./theme.interface";
import { ISpotifyState } from "./spotify.interface";
import { IControlCenterState } from "./controlCenter.state";
export interface IStore {
  theme: IThemeState;
  spotify: ISpotifyState;
  controlCenter: IControlCenterState;
}

export interface IEmptyAction {
  type: string;
}
