import { takeLatest, call, put } from "redux-saga/effects";
import {
  getLatestUpdates,
  getProjects,
  getExperience,
} from "@/firebase/firestore";
import logger from "@logger";
import {
  setNowDataSuccess,
  setNowDataError,
  setProjectsDataSuccess,
  setProjectsDataError,
  setExperienceDataSuccess,
  setExperienceDataError,
} from "@store/actions/pages.data.actions";
import {
  INowData,
  IProjectData,
  IExperienceData,
} from "@interfaces/pages.data.interface";
import { EPagesDataActionTypes } from "@store/types";

function* nowPageSaga() {
  try {
    const data: {
      [key: string]: {
        [key: string]: INowData[];
      };
    } = yield call(getLatestUpdates);
    logger.log("[NOW DATA]", data);
    yield put(setNowDataSuccess(data));
  } catch (error) {
    logger.error(error);
    yield put(
      setNowDataError("An error occurred while fetching the latest updates.")
    );
  }
}

function* projectsPageSaga() {
  try {
    const data: {
      featured: IProjectData[];
      open: IProjectData[];
      closed: IProjectData[];
    } = yield call(getProjects);
    logger.log(data);
    logger.log("[PROJECTS DATA]", data);
    yield put(setProjectsDataSuccess(data));
  } catch (error) {
    logger.error(error);
    yield put(
      setProjectsDataError("An error occurred while fetching the projects.")
    );
  }
}

function* experiencePageSaga() {
  try {
    const data: IExperienceData[] = yield call(getExperience);
    logger.log("[EXPERIENCE DATA]", data);
    yield put(setExperienceDataSuccess({ data }));
  } catch (error) {
    logger.error(error);
    yield put(
      setExperienceDataError("An error occurred while fetching the experience.")
    );
  }
}

function* pageDataWatcher() {
  yield takeLatest(EPagesDataActionTypes.SET_NOW_PAGE_DATA, nowPageSaga);
  yield takeLatest(
    EPagesDataActionTypes.SET_PROJECTS_PAGE_DATA,
    projectsPageSaga
  );
  yield takeLatest(
    EPagesDataActionTypes.SET_EXPERIENCE_PAGE_DATA,
    experiencePageSaga
  );
}

export default pageDataWatcher;
