import { EPagesDataActionTypes } from "@store/types";
export interface INowData {
  category: string;
  sub_category: string;
  title: string;
  description: string;
  progress: number | null;
  last_edited_time: string;
  created_time: string;
  link: string | null;
  link_text: string | null;
  image: string | null;
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
  loading: boolean;
}

export interface IPagedDataAction {
  type: EPagesDataActionTypes;
  payload: Partial<IPagesDataState>;
}
