import { IEnv, IConfig } from "@interfaces/config.interface";

const getEnv = (): IEnv => ({
  nodeEnv: process.env.NODE_ENV,
  spotifyClientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  spotifyRedirectUri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
  server_url: process.env.NEXT_PUBLIC_SERVER_URL,
  app_version: process.env.NEXT_PUBLIC_APP_VERSION,
  sanity_project_id: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  sanity_dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  firebase_api_key: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  firebase_messaging_sender_id:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  firebase_app_id: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const generateConfig = (env: IEnv): IConfig => {
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return env as IConfig;
};

export default generateConfig(getEnv());
