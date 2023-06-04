export interface IEnv {
  nodeEnv?: string;
  spotifyClientId?: string;
  spotifyClientSecret?: string;
  spotifyRedirectUri?: string;
  server_url?: string;
  app_version?: string;
  sanity_project_id?: string;
  sanity_dataset?: string;
  firebase_api_key?: string;
  firebase_messaging_sender_id?: string;
  firebase_app_id?: string;
}

export type IConfig = Required<IEnv>;
