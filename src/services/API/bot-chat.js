import axios from "axios";
import { BASE_URL_API } from "./config";
const getChatAI = async () => {
    try {
      const response = await axios.get(BASE_URL_API + "chat-bot");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export {
  getChatAI
}  