import { CONFIG, HEADERS } from "./config";

const productOfTheSameType = async (idCategory) => {
    return (
      await CONFIG.get("product-of-the-same-type/" + idCategory, {
        headers: HEADERS
      })
    ).data;
  };
  
  const getProductDetail = async (idProduct) => {
    return (
      await CONFIG.get("product-detail/" + idProduct, { headers: HEADERS })
    ).data;
  };
  
  const getProducts = async () => {
    return (await CONFIG.get("product", { headers: HEADERS })).data;
  };
  
  const productOfShop = async (idStore) => {
    return (
      await CONFIG.get("product-of-shop-api/" + idStore, {
        headers: HEADERS
      })
    ).data;
  };
  
  const categoryOfShop = async (idStore) => {
    return (
      await CONFIG.get("category-of-shop-api/" + idStore, {
        headers: HEADERS
      })
    ).data;
  };

export {
    productOfTheSameType,
    getProductDetail,
    getProducts,
    productOfShop,
    categoryOfShop
}  