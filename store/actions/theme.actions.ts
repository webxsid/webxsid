import { IThemeAction } from "@interfaces/index";
import { ThemeActionTypes } from "@store/types";

const toggleDarkMode = (): IThemeAction => ({
  type: ThemeActionTypes.TOGGLE_DARK_MODE,
});

const toggleSystemDefault = (): IThemeAction => ({
  type: ThemeActionTypes.TOGGLE_SYSTEM_DEFAULT,
});

const setDarkMode = (payload: boolean): IThemeAction => ({
  type: ThemeActionTypes.SET_DARK_MODE,
  payload,
});

export { toggleDarkMode, toggleSystemDefault, setDarkMode };
