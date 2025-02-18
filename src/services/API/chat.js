import axios from "axios";
import {CONFIG} from "./config";
import {getToken} from "./token";


const getChat = async (idStore) => {
  try {
    const TOKEN = await getToken();
    const response = await CONFIG.post("historyChat",{sender: TOKEN,idStore,typeMessage:'App'});
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw error;
  }
};

export { getChat};
