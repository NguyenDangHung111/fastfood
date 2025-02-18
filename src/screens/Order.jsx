// Update v1.0

import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { API } from "../services";
import { Ionicons } from "@expo/vector-icons";
import Loading from "../components/Loading";
import OrderNull from "../components/Notification_Order";

const Order = ({ navigation }) => {
  const [DATA, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const PRODUCT_IS_WAITING_ACCEPT = 1;

  useEffect(() => {
    API.listProductInCart(PRODUCT_IS_WAITING_ACCEPT)
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, []);

  //Loading
  if (loading) return <Loading />;

  // notification order null
  if ((DATA.length == 0) == true) return <OrderNull navigation={navigation} />;

  const ListOrder = ({ data }) => {
    return (
      <View>
        {data.map((item, index) => (
          <View key={index} style={styles.itemRender2}>
            <Image
              contentFit="cover"
              source={{
                uri: API.BASE_URL_IMAGE + item.productModel.image,
              }}
              style={styles.sizeImage}
            />
            <View style={styles.containerProduct}>
              <Text
                style={styles.textPrice}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                <Ionicons name="shield-checkmark" size={13} color="green" />{" "}
                {item.productModel.name} - {item.productModel.price} VNĐ
              </Text>

              <View style={styles.box}>
                <Text style={styles.Text}> Số Lượng: x {item.quantity}</Text>
                <Text style={styles.Text}>
                  {" "}
                  Thanh Toán: {item.price}.000 VNĐ
                </Text>
                <Text style={styles.Text}>
                  {" "}
                  Tình Trạng: Đơn hàng đang được xử lí
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.box1}>
        <ListOrder data={DATA} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textPrice:{
    width: "100%",
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#777"
  },
  containerProduct: {
    marginLeft: 10,
    display: "flex",
    flexDirection: "column",
    width: "80%",
  },
  sizeImage: {
    width: 80,
    height: 60,
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 60,
    display: "flex",
    flexDirection: "column",
  },
  Text: {
    fontSize: 13,
    fontWeight: "500",
    color: "#777",
    fontStyle: "italic",
  },
  box1: {
    flex: 1,
    marginTop: 41,
  },
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "left",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    // textDecorationLine: "line-through",
    fontStyle: "italic",
  },
  itemRender2: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: 100,
    borderTopWidth: 5,
    borderColor: "#eee",
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
});

export default Order;
