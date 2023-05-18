import { config } from "@config/env.config";
import { INowData } from "@interfaces/pages.data.interface";
import axios from "axios";

const { server_url } = config;
const api = axios.create({
  baseURL: server_url,
  timeout: 10000,
});

export const getLatestUpdates = async (): Promise<{
  [key: string]: {
    [key: string]: INowData[];
  };
}> => {
  const { data } = await api.get("/api/now");
  return data;
};
