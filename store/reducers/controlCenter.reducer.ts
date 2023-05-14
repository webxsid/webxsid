import {
  IControlCenterState,
  IControlCenterAction,
} from "@interfaces/controlCenter.state";
import { ControlCenterActionTypes } from "@store/types";

const initialState: IControlCenterState = {
  open: false,
};

function controlCenterReducer(
  state: IControlCenterState = initialState,
  action: IControlCenterAction
): IControlCenterState {
  switch (action.type) {
    case ControlCenterActionTypes.TOGGLE_CONTROL_CENTER:
      return {
        ...state,
        open: action.payload,
      };
    default:
      return state;
  }
}

export default controlCenterReducer;
