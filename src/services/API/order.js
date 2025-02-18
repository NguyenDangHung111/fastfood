import axios from "axios";
import { BASE_URL_API } from "./config";
import { getToken } from "./token";

const addOrder = async (idStore) => {
    try {
      const TOKEN = await getToken();
      const response = await axios.post(
        BASE_URL_API + "add-order",
        { idStore },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw "addOrder: "+error;
    }
  };
  
  const updateStatusOrder = async (idOrder,status) => {
    try {
      const TOKEN = await getToken();
      const response = await axios.put(
        BASE_URL_API + "update-status-order",
       {idOrder,status},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
  
      return response;
    } catch (error) {
      console.info("updateStatusError" + error);
      throw error;
    }
  };

 export{
    addOrder,
    updateStatusOrder
 } 