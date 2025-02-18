// Update v1.0
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { API } from "../services";
import { Ionicons } from "@expo/vector-icons";
import Loading from "../components/Loading";
import HistoryNull from "../components/Notification_History";

const History = ({ navigation }) => {
  const [DATA, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const PRODUCT_IS_DELIVERED = 3;

  useEffect(() => {
    API.listProductInCart(PRODUCT_IS_DELIVERED)
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;
  if ((DATA.length == 0) == true) return <HistoryNull navigation={navigation} />;

  const CardListHistory = ({ data }) => {
    return (
      <View>
        {data.map((item, index) => (
          <View key={index} style={styles.itemRender1}>
            <View style={styles.containerTime}>
              <Text style={styles.textTime}>{item.orderModel.created_at}</Text>
            </View>
            <View style={styles.itemRender2}>
              <Image
                contentFit="cover"
                source={{
                  uri: API.BASE_URL_IMAGE + item.productModel.image,
                }}
                style={styles.sizeImage}
              />
              <View style={styles.containerInformation}>
                <Text
                  style={styles.textPrice}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <Ionicons name="shield-checkmark" size={13} color="green" />
                  {item.productModel.name + " - " + parseFloat(item.productModel.price).toFixed(3).replace(".", ",") + " VNĐ"}           
                </Text>
                <View style={styles.box}>
                  <Text style={styles.Text}>{"Số Lượng: x "+item.quantity}</Text>
                  <Text style={styles.Text}>{"Thanh Toán: "+item.price.toFixed(3).replace(".", ",") + " VNĐ"}</Text>
                  <Text style={styles.Text}> Tình Trạng: Đã giao</Text>
                  <Text style={styles.Text}>{"Thời gian: "+item.orderModel.receive_at}</Text>
                </View>
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
        <CardListHistory data={DATA} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textPrice: {
    width: "100%",
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#777",
  },
  containerInformation: {
    marginLeft: 10,
    display: "flex",
    flexDirection: "column",
    width: "80%",
  },
  sizeImage: {
    width: 80,
    height: 60,
  },
  textTime: {
    fontWeight: "bold",
    color: "#777",
    paddingLeft: 5,
    paddingRight: 5,
  },
  containerTime: {
    height: 20,
    width:95,
    backgroundColor: "#eee",
    position: "relative",
    top: -14,
    borderRadius: 5,
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 50,
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
    height: 90,
  },
  itemRender1: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: 130,
    borderTopWidth: 5,
    borderColor: "#eee",
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 15,
    marginTop: 15,
  },
});

export default History;
