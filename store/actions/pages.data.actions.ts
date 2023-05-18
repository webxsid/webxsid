import { IPagedDataAction, INowData } from "@interfaces/pages.data.interface";
import { IEmptyAction } from "@interfaces/store.interface";
import { EPagesDataActionTypes } from "@store/types";

export const setNowData = (): IEmptyAction => ({
  type: EPagesDataActionTypes.SET_NOW_PAGE_DATA,
});

export const setNowDataSuccess = (payload: {
  [key: string]: {
    [key: string]: INowData[];
  };
}): IPagedDataAction => ({
  type: EPagesDataActionTypes.SET_NOW_DATA_SUCCESS,
  payload: {
    now: {
      data: payload,
      date: new Date().toISOString(),
      error: "",
    },
  },
});

export const setNowDataError = (payload: string): IPagedDataAction => ({
  type: EPagesDataActionTypes.SET_NOW_DATA_ERROR,
  payload: {
    now: {
      data: {},
      date: new Date().toISOString(),
      error: payload,
    },
  },
});
