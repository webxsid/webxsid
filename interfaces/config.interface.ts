export interface IEnv {
  nodeEnv?: string;
  spotifyClientId?: string;
  spotifyClientSecret?: string;
  spotifyRedirectUri?: string;
  server_url?: string;
  app_version?: string;
  firebase_api_key?: string;
  firebase_messaging_sender_id?: string;
  firebase_app_id?: string;
  emailjs_public_key?: string;
  emailjs_service_id?: string;
  emailjs_my_template_id?: string;
  emailjs_user_template_id?: string;
}

export type IConfig = Required<IEnv>;
