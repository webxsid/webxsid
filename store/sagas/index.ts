import { all, fork } from "redux-saga/effects";
const sagas: any[] = [];

function* rootSaga() {
  yield all(sagas.map((saga) => fork(saga)));
}

export default rootSaga;
