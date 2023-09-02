import { firebaseConfig } from "@config/index";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
export const database = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);

export default firebaseApp;
