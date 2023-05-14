import { ControlCenterActionTypes } from "@store/types";

export interface IControlCenterState {
  open: boolean;
}

export interface IControlCenterAction {
  type: ControlCenterActionTypes;
  payload: boolean;
}
