import { firestore } from ".";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { config } from "@config/index";
import {
  INowData,
  IProjectData,
  IExperienceData,
} from "@interfaces/pages.data.interface";
import sanitizeFirebaseData from "@/utils/sanitise.util";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import logger from "@logger";

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

export const getProjects = async (): Promise<{
  featured: IProjectData[];
  open: IProjectData[];
  closed: IProjectData[];
}> => {
  console.log("getProjects");
  const data = await getDocs(collection(firestore, "projects"));
  const projectsData: {
    featured: IProjectData[];
    open: IProjectData[];
    closed: IProjectData[];
  } = {
    featured: [],
    open: [],
    closed: [],
  };
  data.forEach(async (doc) => {
    const docData = await sanitizeFirebaseData(doc.data(), doc.id);
    if (docData.is_featured) {
      projectsData.featured.push(docData as IProjectData);
    }
    if (docData.is_open) {
      projectsData.open.push(docData as IProjectData);
    } else {
      projectsData.closed.push(docData as IProjectData);
    }
  });

  projectsData.featured.sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
  projectsData.open.sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
  projectsData.closed.sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  console.log(projectsData);

  return projectsData;
};

export const getExperience = async (): Promise<IExperienceData[]> => {
  const data = await getDocs(collection(firestore, "experience"));
  const experienceData: IExperienceData[] = [];
  data.forEach(async (doc) => {
    const docData = await sanitizeFirebaseData(doc.data(), doc.id);
    experienceData.push(docData as IExperienceData);
  });

  experienceData.sort((a, b) => {
    return (
      new Date(b.positions[0].start_date).getTime() -
      new Date(a.positions[0].start_date).getTime()
    );
  });

  logger.log(experienceData);

  return experienceData;
};

export const sendMessage = async ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}): Promise<void> => {
  try {
    const docRef = await addDoc(collection(firestore, "messages"), {
      name,
      email,
      message,
      date: new Date().toLocaleDateString(),
      isReplied: false,
    });
    console.log("Document written with ID: ", docRef.id);
    console.log("Configuring emailjs...");
    emailjs.init(config.emailjs_public_key);
    // send email to user
    console.log("Sending email to user...");
    emailjs.send(config.emailjs_service_id, config.emailjs_user_template_id, {
      to_name: name,
      to_email: email,
      message: message,
      from_name: "Siddharth Mittal",
      reply_to: "siddharthmittal2101@gmail.com",
    });
    // send email to me
    console.log("Sending email to me...");
    emailjs.send(config.emailjs_service_id, config.emailjs_my_template_id, {
      from_name: name,
      message: message,
      reply_to: email,
    });
    toast.success("Message sent successfully!");
  } catch (e) {
    console.error("Error adding document: ", e);
    toast.error("An error occurred while sending the message.");
  }
};
