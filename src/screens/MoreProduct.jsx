// Update v1.0
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { FlatGrid } from "react-native-super-grid";
import { API } from "../services";
import { Entypo } from "@expo/vector-icons";
import Loading from "../components/Loading";

const MoreProduct = ({ navigation, route }) => {
  const { products } = route.params;
  const [loading, setLoading] = useState(false);

  const renderItemSale = ({ item }) => (
    <TouchableOpacity
      style={styles.itemRender}
      onPress={() => {
        {
          setLoading(true),
            navigation.replace("DetailProduct", { item }, setLoading(false));
        }
      }}
    >
      <View style={styles.containerImage}>
        <Image
          contentFit="cover"
          source={{ uri: API.BASE_URL_IMAGE + item.image }}
          style={styles.sizeImage}
        />
      </View>
      <View style={styles.containerSale}>
        <Text style={styles.textSale}>
          {"-" + item.categoryModel.sale + "%"}
        </Text>
      </View>
      <View style={styles.containerInformationProduct}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.name} -<Entypo name="shop" size={13} color="green" />{" "}
          {item.categoryModel.storeModel.name}
        </Text>
        <Text style={styles.price}>Giá: {item.price} VNĐ</Text>
        <Text style={styles.discount}>
          Chỉ còn:{" "}
          {(
            parseFloat(item.price.replace(",", ".")) -
            (item.categoryModel.sale *
              parseFloat(item.price.replace(",", "."))) /
              100
          )
            .toFixed(3)
            .replace(".", ",") + " VNĐ"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemRender}
      onPress={() => {
        {
          setLoading(true),
            navigation.replace("DetailProduct", { item }, setLoading(false));
        }
      }}
    >
      <View style={styles.containerImage}>
        <Image
          contentFit="cover"
          source={{ uri: API.BASE_URL_IMAGE + item.image }}
          style={styles.sizeImage}
        />
      </View>
      <View style={styles.containerInformationProduct}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.name} -<Entypo name="shop" size={13} color="green" />{" "}
          {item.categoryModel.storeModel.name}
        </Text>
        <Text style={styles.price}>Giá: {item.price} VNĐ</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatGrid
        itemDimension={130}
        data={products}
        style={styles.gridView}
        spacing={10}
        renderItem={
          products[0].categoryModel.sale > 0 ? renderItemSale : renderItem
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerInformationProduct: {
    width: "100%",
    height: "30%",
    position: "absolute",
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textSale: {
    color: "white",
    fontWeight: "bold",
  },
  containerSale: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "red",
    height: 20,
    width: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 10,
  },
  sizeImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    borderRadius: 3,
  },
  containerImage: {
    width: "100%",
    height: "70%",
    position: "absolute",
    top: 0,
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
  title: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#777",
    marginTop: 10,
    fontStyle: "italic",
  },
  price2: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    // textDecorationLine: "line-through",
    fontStyle: "italic",
  },
  itemRender: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 160,
    height: 250,
    borderWidth: 1.5,
    borderColor: "#eee",
    borderRadius: 3,
    marginVertical: 5,
  },
  gridView: {
    // height: "100%",
    marginTop: 41,
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 60,
  },
});

export default MoreProduct;
