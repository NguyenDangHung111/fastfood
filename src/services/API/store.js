import {TOKEN,CONFIG } from "./config";

const addStore = async (formInfo) => {
    try {
      const response = await CONFIG.post("add-store", formInfo, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export{
    addStore
  }
  