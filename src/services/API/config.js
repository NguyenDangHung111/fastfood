import axios from "axios";

const IP = "192.168.1.47";
const BASE_URL_API = "http://" + IP + ":8080/api/v1/";
const BASE_URL_IMAGE = "http://" + IP + ":8080/image/";

const CONFIG = axios.create({
  baseURL: BASE_URL_API,
  httpsAgent: {
    rejectUnauthorized: false,
  },
});

const HEADERS = {                     
  "Content-Type": "application/json",
};
export {
  CONFIG,
  HEADERS,
  BASE_URL_IMAGE,
  BASE_URL_API,
  IP
};
