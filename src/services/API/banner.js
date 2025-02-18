import axios from "axios";
import { BASE_URL_API } from "./config";

const getBanner = async () => {
  try {
    const response = await axios.get(BASE_URL_API + "banner");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getBanner };
