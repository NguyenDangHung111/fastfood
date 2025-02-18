import axios from "axios";
import { BASE_URL_API, HEADERS, CONFIG } from "./config";
import { getToken } from "./token";

const updatePrice = async (idOrder) => {
  try {
    const response = await axios.put(
      BASE_URL_API + "update-price-for-order-item",
      { idOrder },
      {
        headers: {
          HEADERS,
        },
      }
    );

    return response;
  } catch (error) {
    console.info("updateStatusError" + error);
    throw error;
  }
};

const updateQuantity = async (id, quantity) => {
  return (
    await CONFIG.put(
      BASE_URL_API + "update-quantity-for-order-item",
      {
        id,
        quantity,
      },
      { headers: HEADERS }
    )
  ).data;
};

const listProductInCart = async (statusOrderItem) => {
  try {
    const TOKEN = await getToken();
      const response = await axios.get(BASE_URL_API + "order-item", {
        params: { statusOrderItem },
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      return response.data;
  } catch (error) {
    throw "listProductInCart: " + error;
  }
};

const listOrderOfShipper = async (statusOrderItem) => {
  try {
    const TOKEN = await getToken();
    const response = await axios.get(BASE_URL_API + "order-of-shipper", {
      params: { statusOrderItem },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listOrderForShipper = async (statusOrderItem) => {
  try {
    const response = await axios.get(BASE_URL_API + "order-for-shipper", {
      params: { statusOrderItem },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addOrderItem = async (idOrder, idProduct, quantity) => {
  return (
    await CONFIG.post(
      "add-order-item",
      {
        idOrder,
        idProduct,
        quantity,
      },
      { headers: HEADERS }
    )
  ).data;
};

export {
  updatePrice,
  updateQuantity,
  listProductInCart,
  listOrderForShipper,
  listOrderOfShipper,
  addOrderItem,
};
