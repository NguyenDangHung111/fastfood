import axios from "axios";
import { BASE_URL_API, CONFIG } from "./config";
import { getToken } from "./token";

const getComment = async (idProduct) => {
  try {
    const response = await axios.get(
      BASE_URL_API + "comment-product/" + idProduct
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addComment = async (formInfo) => {
  try {
    const TOKEN = await getToken();
    const response = await CONFIG.post("add-comment", formInfo, {
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

export { getComment, addComment };
