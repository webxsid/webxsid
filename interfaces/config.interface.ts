export interface IEnv {
  nodeEnv?: string;
  spotifyClientId?: string;
  spotifyClientSecret?: string;
  spotifyRedirectUri?: string;
  server_url?: string;
  app_version?: string;
}

export type IConfig = Required<IEnv>;
