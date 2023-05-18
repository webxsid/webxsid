import { combineReducers } from "redux";
import themeReducer from "./theme.reducer";
import spotifyReducer from "./spotify.reducer";
import controlCenterReducer from "./controlCenter.reducer";
import pagesDataReducer from "./pages.data.reducer";

const rootReducer = combineReducers({
  theme: themeReducer,
  spotify: spotifyReducer,
  controlCenter: controlCenterReducer,
  pagesData: pagesDataReducer,
});

export default rootReducer as typeof rootReducer;
