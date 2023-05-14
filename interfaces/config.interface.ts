export interface IEnv {
  nodeEnv?: string;
  spotifyClientId?: string;
  spotifyClientSecret?: string;
  spotifyRedirectUri?: string;
}

export type IConfig = Required<IEnv>;
