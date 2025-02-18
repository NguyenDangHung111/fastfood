const listIdOrder = (cartItems) => {
  const listIdProduct = [];
  for (let i = 0; i < cartItems.length; i++) {
    listIdProduct.push(cartItems[i].orderModel.id);
  }
  return listIdProduct;
};

const totalPriceProduct = (cartItems) => {
  return cartItems
    .reduce((total, item) => {
      return (
        total +
        (
          parseFloat(item.productModel.price.replace(",", ".")) -
          (item.productModel.categoryModel.sale *
            parseFloat(item.productModel.price.replace(",", "."))) /
            100
        )
          .toFixed(3)
          .replace(",", ".") *
          item.quantity
      );
    }, 0)
    .toLocaleString("vi-VN", { minimumFractionDigits: 3 })
    .replace(/,/g, ",");
};

export { listIdOrder, totalPriceProduct };
