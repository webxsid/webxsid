import { ThemeActionTypes } from "@store/types";

export interface IThemeState {
  darkMode: boolean;
  systemDefault: boolean;
}

export interface IThemeAction {
  type: ThemeActionTypes;
  payload?: boolean;
}
