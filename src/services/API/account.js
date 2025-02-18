import axios from "axios";
import { BASE_URL_API, CONFIG } from "./config";
import {saveToken,getToken,removeToken} from "./token";

const updateAccount = async (formData) => {
  try {
    const TOKEN = await getToken();
    const response = await CONFIG.post("update-profile", formData, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Network error: " + error.message);
  }
};

const detailAccount = async () => {
  try {
    const TOKEN = await getToken();
    const response = await axios.get(BASE_URL_API + "profile", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    return "detailAccount: "+error;
  }
};

const logout = () => {
  return removeToken();
};

const login = async (email, password) => {
  try {
    const response = await CONFIG.post("auth/login", { email, password });
    if (response.status === 200) {
      const token = response.data;
      if (token) {
        saveToken(token);
        // console.log("token: ", token);
        return true;
      }
    } else if (response.status === 404) {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const sendOtp = async (email) => {
  try {
    const TOKEN = await getToken();
    const response = await CONFIG.post(
      "auth/sendOtp",
      { email },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    if (response.status === 200) {
      return true;
    } else if (response.status === 500) {
      return false;
    }
  } catch (error) {
    console.log("sendOtp: "+error);
    return false;
  }
};

const checkEmail = async (email) => {
  try {
    const response = await CONFIG.post("auth/checkEmail", {email});

    if (response.status === 200) {
      return true;
    } else if (response.status === 404) {
      return false;
    }
  } catch (error) {
    return false; // Trả về false nếu có lỗi xảy ra
  }
};

const checkOtp = async (otp) => {
  try {
    const TOKEN = await getToken();
    const response = await CONFIG.post(
      "auth/checkOtp",
      {otp},
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    if (response.status == 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const createAccount = async (email, password) => {
  try {
    const response = await CONFIG.post("auth/signUp", {email, password});

    if (response.status === 200) {
      saveToken(response.data);
      return true;
    } else if (response.status === 500) {
      return false;
    }
  } catch (error) {
    console.log("createAccount: "+error);
    return false;
  }
};

const forgotPassword = async (email, password) => {
  try {
    const response = await CONFIG.post("/forgotPassword", { email, password });

    if (response.status === 201) {
      return true;
    } else if (response.status === 500) {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export {
  updateAccount,
  detailAccount,
  login,
  logout,
  sendOtp,
  checkEmail,
  checkOtp,
  createAccount,
  forgotPassword,
};
