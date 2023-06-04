const sanitizeFirebaseData = async (
  data: any
): Promise<{
  [key: string]: any;
}> => {
  return new Promise((resolve, reject) => {
    try {
      let responseObject: {
        [key: string]: any;
      } = {};
      Object.entries(data).forEach(([key, value]) => {
        const sanitizedKey = key.replace(/\s+/g, "_").toLowerCase();
        responseObject[sanitizedKey] = value;
      });
      resolve(responseObject);
    } catch (error) {
      reject(error);
    }
  });
};

export default sanitizeFirebaseData;
