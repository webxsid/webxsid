import { database } from ".";
import { ref, get } from "firebase/database";

export const getLastUpdateDate = async (path: string) => {
  const dbRef = ref(database, `updateDates/${path}`);
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};
