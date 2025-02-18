import {
  updateAccount,
  detailAccount,
  login,
  logout,
  sendOtp,
  checkEmail,
  checkOtp,
  createAccount,
  forgotPassword,
} from "./account";
import {
  updatePrice,
  updateQuantity,
  listProductInCart,
  listOrderForShipper,
  listOrderOfShipper,
  addOrderItem,
} from "./order-item";
import {
  productOfTheSameType,
  getProductDetail,
  getProducts,
  productOfShop,
  categoryOfShop,
} from "./product";
import { getBanner } from "./banner";
import { getChatAI } from "./bot-chat";
import { getComment, addComment } from "./comment";
import { IP,BASE_URL_IMAGE } from "./config";
import { addOrder, updateStatusOrder } from "./order";
import { addStore } from "./store";
import { getToken,getIdAccount } from "./token";
import {getChat,connectWebSocket,sendMessage} from "./chat"

//Pass:Hung1234@

export {
  IP,
  BASE_URL_IMAGE,
  addStore,
  login,
  logout,
  detailAccount,
  sendOtp,
  checkEmail,
  checkOtp,
  createAccount,
  forgotPassword,
  getProducts,
  getProductDetail,
  addOrder,
  addOrderItem,
  listProductInCart,
  updateQuantity,
  productOfTheSameType,
  getComment,
  addComment,
  updateAccount,
  getBanner,
  updatePrice,
  productOfShop,
  categoryOfShop,
  listOrderForShipper,
  listOrderOfShipper,
  updateStatusOrder,
  getToken,
  getChatAI,
  getChat,
  getIdAccount
};
