import { IThemeState, IThemeAction } from "@interfaces/index";
import { ThemeActionTypes } from "@store/types";

const initialState: IThemeState = {
  darkMode: false,
  systemDefault: true,
};

const themeReducer = (state = initialState, action: IThemeAction) => {
  switch (action.type) {
    case ThemeActionTypes.TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case ThemeActionTypes.TOGGLE_SYSTEM_DEFAULT:
      return {
        ...state,
        systemDefault: !state.systemDefault,
      };
    case ThemeActionTypes.SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload,
      };
    default:
      return state;
  }
};

export default themeReducer;
// Path: store/reducers/index.ts
