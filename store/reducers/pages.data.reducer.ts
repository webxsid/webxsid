import { IPagesDataState } from "@interfaces/pages.data.interface";
import { EPagesDataActionTypes } from "@store/types";
const initialState: IPagesDataState = {
  now: {
    data: {},
    date: "",
    error: "",
  },
  projects: {
    featured: [],
    open: [],
    closed: [],
    error: "",
    date: "",
  },
  experience: {
    data: [],
    date: "",
    error: "",
  },
  loading: false,
};

function pagesDataReducer(
  state: IPagesDataState = initialState,
  action: any
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

    case EPagesDataActionTypes.SET_PROJECTS_PAGE_DATA:
      return {
        ...state,
        loading: true,
      };

    case EPagesDataActionTypes.SET_PROJECTS_DATA_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        projects: {
          ...action.payload.projects,
        },
        loading: false,
      };

    case EPagesDataActionTypes.SET_PROJECTS_DATA_ERROR:
      return {
        ...state,
        projects: {
          ...state.projects,
          error: action.payload.projects.error,
          date: action.payload.projects.date,
        },
        loading: false,
      };

    case EPagesDataActionTypes.UPDATE_PROJECTS_DATE:
      return {
        ...state,
        projects: {
          ...state.projects,
          date: new Date().toISOString(),
        },
        loading: false,
      };

    case EPagesDataActionTypes.SET_EXPERIENCE_PAGE_DATA:
      return {
        ...state,
        loading: true,
      };

    case EPagesDataActionTypes.SET_EXPERIENCE_DATA_SUCCESS:
      return {
        ...state,
        experience: {
          ...action.payload.experience,
        },
        loading: false,
      };

    case EPagesDataActionTypes.SET_EXPERIENCE_DATA_ERROR:
      return {
        ...state,
        experience: {
          ...state.experience,
          error: action.payload.experience.error,
          date: action.payload.experience.date,
        },
        loading: false,
      };

    case EPagesDataActionTypes.UPDATE_EXPERIENCE_DATE:
      return {
        ...state,
        experience: {
          ...state.experience,
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
