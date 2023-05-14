import { IEnv, IConfig } from "@interfaces/config.interface";

const getEnv = (): IEnv => ({
  nodeEnv: process.env.NODE_ENV,
  spotifyClientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  spotifyRedirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
});

const generateConfig = (env: IEnv): IConfig => {
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return env as IConfig;
};

export const config = generateConfig(getEnv());
