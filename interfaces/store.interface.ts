import { IThemeState } from "./theme.interface";
import { ISpotifyState } from "./spotify.interface";
import { IControlCenterState } from "./controlCenter.state";
import { IPagesDataState } from "./pages.data.interface";
export interface IStore {
  theme: IThemeState;
  spotify: ISpotifyState;
  controlCenter: IControlCenterState;
  pagesData: IPagesDataState;
}

export interface IEmptyAction {
  type: string;
}
