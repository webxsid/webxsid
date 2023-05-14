import { IControlCenterAction } from "@interfaces/controlCenter.state";
import { ControlCenterActionTypes } from "@store/types";

export const toggleControlCenter = (
  payload: boolean
): IControlCenterAction => ({
  type: ControlCenterActionTypes.TOGGLE_CONTROL_CENTER,
  payload: payload,
});
