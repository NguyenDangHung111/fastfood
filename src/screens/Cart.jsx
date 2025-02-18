// Update v1.0
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import { API } from "../services";
import Loading from "../components/Loading";
import CartNull from "../components/Notification_Cart";
import { SERVICE } from "../services";

const Cart = ({ navigation }) => {
  const [productInCart, setProductInCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const PRODUCT_IN_CART = 0;
  const PRODUCT_IS_AWAITING_ACCEPT = 1;

  useEffect(() => {
    API.listProductInCart(PRODUCT_IN_CART)
      .then((data) => {
        setProductInCart(data);
        setLoading(false);
      })
      .catch(() => {
        setProductInCart([]);
        navigation.navigate("Home");
        navigation.navigate("Stack5");
      });
  }, []);

  //Loading
  if (loading) return <Loading />;

  if ((productInCart.length == 0) == true) return <CartNull navigation={navigation} />;

  function handleBuy(idOrder, status) {
    // orderItem
    API.updatePrice(idOrder).then((response) => {
      if (response.status == 200) {
        navigation.navigate("Order");
      }
    });
    // order
    API.updateStatusOrder(idOrder, status).then((response) => {
      if (response.status == 200) {
        navigation.navigate("Order");
      }
    });
  };

   async function handleIncreaseQuantityProduct(item){
    await API.updateQuantity(item.id, item.quantity + 1),
    await API.listProductInCart(PRODUCT_IN_CART).then((data) => {
        setProductInCart(data);
      });
  };

  async function handleDecreaseQuantityProduct(item){
   await API.updateQuantity(item.id, item.quantity - 1),
    await API.listProductInCart(PRODUCT_IN_CART).then((data) => {
        setProductInCart(data);
      });
  };

  const CardQuantity = ({item}) => {
    return (
      <View style={styles.box}>
        <TouchableOpacity
          onPress={() => {
            handleDecreaseQuantityProduct(item);
          }}
        >
          <AntDesign name="minuscircle" size={20} color="orange" />
        </TouchableOpacity>

        <Text style={styles.textQuantity}>{item.quantity}</Text>

        <TouchableOpacity
          onPress={() => {
            handleIncreaseQuantityProduct(item);
          }}
        >
          <AntDesign name="pluscircle" size={20} color="orange" />
        </TouchableOpacity>
      </View>
    );
  };

  const CardProduct = ({ item }) => {
    return (
      <View style={styles.viewListProduct}>
        <Text
          style={styles.textNameProduct}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          <Ionicons name="shield-checkmark" size={13} color="#FFBA49" />{" "}
          {item.productModel.name}
          {" - "}
          <Entypo name="shop" size={13} color="green" />{" "}
          {item.orderModel.storeModel.name}
        </Text>
        {item.productModel.categoryModel.sale > 0 ? (
          <Text style={styles.price}>
            Giá: {item.productModel.price} VNĐ{" "}
            {" - Giảm: " + item.productModel.categoryModel.sale + "%"}{" "}
          </Text>
        ) : (
          <Text style={styles.price}>Giá: {item.productModel.price} VNĐ </Text>
        )}
        {item.productModel.categoryModel.sale > 0 ? (
          <Text style={styles.discount}>
            Chỉ còn:{" "}
            {(
              parseFloat(item.productModel.price.replace(",", ".")) -
              (item.productModel.categoryModel.sale *
                parseFloat(item.productModel.price.replace(",", "."))) /
                100
            )
              .toFixed(3)
              .replace(".", ",") + " VNĐ"}
          </Text>
        ) : (
          <Text style={styles.price}></Text>
        )}
      </View>
    );
  };

  const ListProduct = ({ data }) => {
    return (
      <View>
        {data.map((item, index) => (
          <View key={index} style={styles.cardProduct}>
            <Image
              contentFit="cover"
              source={{
                uri: API.BASE_URL_IMAGE + item.productModel.image,
              }}
              style={styles.sizeImage}
            />
            <CardProduct item={item} />
            <CardQuantity item={item} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.boxProduct}>
        <ListProduct data={productInCart} />
      </ScrollView>
      <View style={styles.boxPrice}>
        <View style={styles.viewPrice}>
          <Text style={styles.text}>
            Tổng Cộng: {SERVICE.totalPriceProduct(productInCart)} VNĐ
          </Text>
        </View>
        <TouchableOpacity
          style={styles.buttonBuy}
          onPress={() =>
            handleBuy(
              SERVICE.listIdOrder(productInCart),
              PRODUCT_IS_AWAITING_ACCEPT
            )
          }
        >
          <Text style={styles.text}>Đặt Hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sizeImage: {
    width: 60,
    height: 60,
  },
  viewListProduct: {
    marginLeft: 10,
    display: "flex",
    flexDirection: "column",
  },
  textNameProduct: {
    width: "90%",
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#777",
  },
  textQuantity: {
    color: "#777",
    paddingHorizontal: 7,
    fontWeight: "bold",
  },
  box: {
    position: "absolute",
    right: 10,
    height: 75,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    // textDecorationLine: "line-through",
    fontStyle: "italic",
  },
  discount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red",
    fontStyle: "italic",
  },
  cardProduct: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: 75,
    borderTopWidth: 5,
    borderColor: "#eee",
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  text: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 13,
    fontStyle: "italic",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 60,
    display: "flex",
    flexDirection: "column",
  },
  boxProduct: {
    flex: 1,
    marginTop: 41,
  },
  boxPrice: {
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 5,
    borderTopColor: "#eee",
  },
  viewPrice: {
    backgroundColor: "red",
    width: "70%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonBuy: {
    backgroundColor: "orange",
    width: "30%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Cart;
