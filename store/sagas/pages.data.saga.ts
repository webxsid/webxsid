import { takeEvery, call, put } from "redux-saga/effects";
import { getLatestUpdates } from "@functions/server.functions";
import {
  setNowDataSuccess,
  setNowDataError,
} from "@store/actions/pages.data.actions";
import { INowData } from "@interfaces/pages.data.interface";
import { EPagesDataActionTypes } from "@store/types";

function* nowPageSaga() {
  try {
    const data: {
      [key: string]: {
        [key: string]: INowData[];
      };
    } = yield call(getLatestUpdates);
    yield put(setNowDataSuccess(data));
  } catch (error) {
    console.log(error);
    yield put(
      setNowDataError("An error occurred while fetching the latest updates.")
    );
  }
}

function* pageDataWatcher() {
  yield takeEvery(EPagesDataActionTypes.SET_NOW_PAGE_DATA, nowPageSaga);
}

export default pageDataWatcher;
