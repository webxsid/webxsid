import { config } from "@config/index";
import { INowData } from "@interfaces/pages.data.interface";
import { createClient, groq } from "next-sanity";
import axios from "axios";

const api = createClient({
  projectId: config.sanity_project_id,
  dataset: config.sanity_dataset,
  useCdn: true,
  apiVersion: new Date().toISOString().slice(0, 10),
});

export const getLatestUpdates = async (): Promise<any> => {
  const data = await api.fetch(groq`*[_type == "now"] | order(date desc)`);
  console.log(data);
  return data;
};
