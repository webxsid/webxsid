import { EPagesDataActionTypes } from "@store/types";
export interface INowData {
  category: string;
  sub_category: string;
  title: string;
  progress: number;
  description: string;
  link: string | null;
  link_text: string | null;
  image: string | null;
}

export interface IProjectData {
  id: string;
  title: string;
  short_description: string;
  description: string;
  github_link?: string;
  demo_link?: string;
  image?: string;
  is_open: boolean;
  components: string[];
  technologies: string[];
  current_status: string;
  progress: number;
  is_featured: boolean;
  featured_image?: string;
  created_at: string;
  updated_at: string;
}
export interface IExperienceData {
  id: string;
  company: string;
  description: string;
  positions: {
    title: string;
    start_date: string;
    end_date?: string;
    isCurrent: boolean;
  }[];
}

export interface IPagesDataState {
  now: {
    data: {
      [key: string]: {
        [key: string]: INowData[];
      };
    };
    date: string;
    error?: string;
  };
  projects: {
    featured: IProjectData[];
    open: IProjectData[];
    closed: IProjectData[];
    error?: string;
    date: string;
  };
  experience: {
    data: IExperienceData[];
    error?: string;
    date: string;
  };
  loading: boolean;
}

export interface INowDataAction {
  type: EPagesDataActionTypes;
  payload: {
    now: {
      data: {
        [key: string]: {
          [key: string]: INowData[];
        };
      };
      date: string;
      error?: string;
    };
  };
}

export interface IProjectsDataAction {
  type: EPagesDataActionTypes;
  payload: {
    projects: {
      featured: IProjectData[];
      open: IProjectData[];
      closed: IProjectData[];
      error?: string;
      date: string;
    };
  };
}

export interface IExperienceDataAction {
  type: EPagesDataActionTypes;
  payload: {
    experience: {
      data: IExperienceData[];
      error?: string;
      date: string;
    };
  };
}
