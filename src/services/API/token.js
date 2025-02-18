import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONFIG } from "./config";

const saveToken = async (token) => {
  await AsyncStorage.setItem("token", token);
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token ? token : null;
  } catch (error) {
    console.log("Lỗi khi lấy token: ", error);
    return null;
  }
};

const removeToken = async () => {
  await AsyncStorage.removeItem("token");
};

const getIdAccount = async () => {
  try {
    const TOKEN = await getToken();
    const response = await CONFIG.post("auth/idAccount",{},{
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw error;
  }
};

export { saveToken, getToken, removeToken,getIdAccount };
