import { all, fork } from "redux-saga/effects";
import pageDataWatcher from "./pages.data.saga";
const sagas: any[] = [pageDataWatcher];

function* rootSaga() {
  yield all(sagas.map((saga) => fork(saga)));
}

export default rootSaga;
