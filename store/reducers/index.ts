import { combineReducers } from "redux";
import themeReducer from "./theme.reducer";
import spotifyReducer from "./spotify.reducer";
import controlCenterReducer from "./controlCenter.reducer";

const rootReducer = combineReducers({
  theme: themeReducer,
  spotify: spotifyReducer,
  controlCenter: controlCenterReducer,
});

export default rootReducer as typeof rootReducer;
