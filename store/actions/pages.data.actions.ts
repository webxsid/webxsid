import {
  INowData,
  IProjectData,
  IExperienceData,
  INowDataAction,
  IProjectsDataAction,
  IExperienceDataAction,
} from "@interfaces/pages.data.interface";
import { IEmptyAction } from "@interfaces/store.interface";
import { EPagesDataActionTypes } from "@store/types";

export const setNowData = (): IEmptyAction => ({
  type: EPagesDataActionTypes.SET_NOW_PAGE_DATA,
});

export const setNowDataSuccess = (payload: {
  [key: string]: {
    [key: string]: INowData[];
  };
}): INowDataAction => ({
  type: EPagesDataActionTypes.SET_NOW_DATA_SUCCESS,
  payload: {
    now: {
      data: payload,
      date: new Date().toISOString(),
      error: "",
    },
  },
});

export const setNowDataError = (payload: string): INowDataAction => ({
  type: EPagesDataActionTypes.SET_NOW_DATA_ERROR,
  payload: {
    now: {
      data: {},
      date: new Date().toISOString(),
      error: payload,
    },
  },
});

export const setProjectsData = (): IEmptyAction => ({
  type: EPagesDataActionTypes.SET_PROJECTS_PAGE_DATA,
});

export const setProjectsDataSuccess = (payload: {
  featured: IProjectData[];
  open: IProjectData[];
  closed: IProjectData[];
}): IProjectsDataAction => ({
  type: EPagesDataActionTypes.SET_PROJECTS_DATA_SUCCESS,
  payload: {
    projects: {
      ...payload,
      date: new Date().toISOString(),
      error: "",
    },
  },
});

export const setProjectsDataError = (payload: string): IProjectsDataAction => ({
  type: EPagesDataActionTypes.SET_PROJECTS_DATA_ERROR,
  payload: {
    projects: {
      featured: [],
      open: [],
      closed: [],
      date: new Date().toISOString(),
      error: payload,
    },
  },
});

export const setExperienceData = (): IEmptyAction => ({
  type: EPagesDataActionTypes.SET_EXPERIENCE_PAGE_DATA,
});

export const setExperienceDataSuccess = (payload: {
  data: IExperienceData[];
}): IExperienceDataAction => ({
  type: EPagesDataActionTypes.SET_EXPERIENCE_DATA_SUCCESS,
  payload: {
    experience: {
      ...payload,
      date: new Date().toISOString(),
      error: "",
    },
  },
});

export const setExperienceDataError = (
  payload: string
): IExperienceDataAction => ({
  type: EPagesDataActionTypes.SET_EXPERIENCE_DATA_ERROR,
  payload: {
    experience: {
      data: [],
      date: new Date().toISOString(),
      error: payload,
    },
  },
});

export const resetPagesData = (): IEmptyAction => ({
  type: EPagesDataActionTypes.RESET,
});
