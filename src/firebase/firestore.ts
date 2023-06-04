import { firestore } from ".";
import { collection, getDocs } from "firebase/firestore";
import { INowData } from "@interfaces/pages.data.interface";
import sanitizeFirebaseData from "@/utils/sanitise.util";

export const getLatestUpdates = async (): Promise<{
  [key: string]: {
    [key: string]: INowData[];
  };
}> => {
  console.log("getLatestUpdates");
  const data = await getDocs(collection(firestore, "now"));
  const nowData: {
    [key: string]: {
      [key: string]: INowData[];
    };
  } = {
    creating: {},
    notes: {},
    consuming: {},
  };
  data.forEach(async (doc) => {
    const docData = await sanitizeFirebaseData(doc.data());
    const category = docData.category.toLowerCase();
    const subCategory = docData.sub_category.toLowerCase();
    if (nowData[category]) {
      if (nowData[category][subCategory]) {
        nowData[category][subCategory].push(docData as INowData);
      } else {
        nowData[category][subCategory] = [docData as INowData];
      }
    } else {
      nowData[category] = {
        [subCategory]: [docData as INowData],
      };
    }
  });

  console.log(nowData);

  return nowData;
};
