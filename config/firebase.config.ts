import config from "./env.config";
const firebaseConfig = {
  apiKey: config.firebase_api_key,
  authDomain: "webxsid.firebaseapp.com",
  projectId: "webxsid",
  storageBucket: "webxsid.appspot.com",
  messagingSenderId: config.firebase_messaging_sender_id,
  appId: config.firebase_app_id,
};

export default firebaseConfig;
