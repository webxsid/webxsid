import {
  IPagesDataState,
  IPagedDataAction,
} from "@interfaces/pages.data.interface";
import { EPagesDataActionTypes } from "@store/types";
const initialState: IPagesDataState = {
  now: {
    data: {},
    date: "",
    error: "",
  },
  loading: false,
};

function pagesDataReducer(
  state: IPagesDataState = initialState,
  action: IPagedDataAction
): IPagesDataState {
  switch (action.type) {
    case EPagesDataActionTypes.SET_NOW_PAGE_DATA:
      return {
        ...state,
        loading: true,
      };

    case EPagesDataActionTypes.SET_NOW_DATA_SUCCESS:
      return {
        ...state,
        now: {
          ...state.now,
          ...action.payload.now,
        },
        loading: false,
      };

    case EPagesDataActionTypes.SET_NOW_DATA_ERROR:
      return {
        ...state,
        now: {
          ...state.now,
          ...action.payload.now,
        },
        loading: false,
      };

    case EPagesDataActionTypes.UPDATE_NOW_DATE:
      return {
        ...state,
        now: {
          ...state.now,
          date: new Date().toISOString(),
        },
        loading: false,
      };

    case EPagesDataActionTypes.RESET:
      return initialState;
    default:
      return state;
  }
}

export default pagesDataReducer;
