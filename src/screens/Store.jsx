// Update v1.0

import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  AntDesign,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome5,
} from "@expo/vector-icons";
import { API } from "../services";
import Loading from "../components/Loading";

const Store = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  //Loading
  const [loading, setLoading] = useState(true);
  //show Image
  const [modalVisible, setModalVisible] = useState(false);
  //Product Of The Same Type
  const [getProductOfTheSameType, setProductOfTheSameType] = useState([]);
  //Category
  const [category, setCategory] = useState([]);
  //Product of Shop
  const [getProductOfShop, setProductOfShop] = useState([]);
  const [getProductOfShop2, setProductOfShop2] = useState([]);
  const [sale, setSale] = useState([]);

  useEffect(() => {
    API.productOfTheSameType(item.categoryModel.id).then((data) => {
      setProductOfTheSameType(
        data.filter(
          (item) => item.categoryModel.status === 0 && item.status === 0
        )
      );
    });
    API.productOfShop(item.categoryModel.storeModel.id).then((data) => {
      setProductOfShop(
        data.filter(
          (item) => item.categoryModel.status === 0 && item.status === 0
        )
      );
      setProductOfShop2(
        data.filter(
          (item) => item.categoryModel.status === 0 && item.status === 0
        )
      );
      setSale(data[0].categoryModel.sale);
    });
    API.categoryOfShop(item.categoryModel.storeModel.id).then((data) => {
      setCategory(data);
      setLoading(false);
    });
  }, []);

  //Loading
  if (loading) return <Loading />;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemRender}
      onPress={() => navigation.replace("DetailProduct", { item })}
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
      <View style={styles.containerNameShop}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.name} -<Entypo name="shop" size={13} color="green" />{" "}
          {item.categoryModel.storeModel.name}
        </Text>
        <Text style={styles.price2}>Giá: {item.price} VNĐ </Text>

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

  const renderItem2 = ({ item }) => (
    <TouchableOpacity
      style={styles.itemRender}
      onPress={() => navigation.replace("DetailProduct", { item })}
    >
      <View style={styles.containerImage}>
        <Image
          contentFit="cover"
          source={{ uri: API.BASE_URL_IMAGE + item.image }}
          style={styles.sizeImage}
        />
      </View>

      <View style={styles.containerNameShop}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.name} -<Entypo name="shop" size={13} color="green" />{" "}
          {item.categoryModel.storeModel.name}
        </Text>
        <Text style={styles.price2}>Giá: {item.price} VNĐ </Text>
      </View>
    </TouchableOpacity>
  );

  const ItemCategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setProductOfShop(
          getProductOfShop2.filter(
            (product) => product.categoryModel.category === item.category
          )
        );
      }}
      style={styles.containerTextCategory}
    >
      <Text style={styles.textCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  const CardProfileShop = () => {
    return (
      <View style={styles.containerProfile}>
        <Text style={styles.text} numberOfLines={2}>
          <Entypo name="shop" size={18} color="green" />{" "}
          {item.categoryModel.storeModel.name} -{" "}
          <Entypo name="old-phone" size={18} color="green" />{" "}
          {item.categoryModel.storeModel.phone}
        </Text>
        <Text style={styles.textEmailShop} numberOfLines={1}>
          <MaterialCommunityIcons name="email" size={19} color="green" />{" "}
          {"Email: " + item.categoryModel.storeModel.email}
        </Text>

        <Text style={styles.textAddressShop}>
          <FontAwesome5 name="running" size={18} color="green" />{" "}
          {"Địa Chỉ: " + item.categoryModel.storeModel.address}
        </Text>
        <Text
          style={styles.textAddressShop}
          onPress={() => navigation.navigate("ChatStore", {
            store: item.categoryModel.storeModel,
          })}
        >
          <FontAwesome5 name="comment-dots" size={18} color="green" />{" "} 
          Bạn muốn hỏi gì ? Nhấn vào đây !
        </Text>
      </View>
    );
  };

  const CardCategoryProduct = () => {
    return (
      <View style={styles.main3}>
        <View style={styles.container}>
          <FlatList
            data={category}
            renderItem={ItemCategory}
            keyExtractor={(item) => item.id}
            horizontal={true} // Cho phép cuộn ngang
            showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
          />
        </View>
      </View>
    );
  };

  const CardProductShop = () => {
    return (
      <View style={styles.main2}>
        <View style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.titleCard}>Sản Phẩm Shop</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MoreProduct", {
                  products: getProductOfShop,
                });
              }}
            >
              <Text style={styles.textShowAll}>
                Xem tất cả{" "}
                <AntDesign name="doubleright" size={13} color="#777" />
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={getProductOfShop}
            renderItem={sale == 0 ? renderItem2 : renderItem}
            keyExtractor={(item) => item.id}
            horizontal={true} // Cho phép cuộn ngang
            showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
          />
        </View>
      </View>
    );
  };

  const CardProductOfTheSameType = () => {
    return (
      <View style={styles.main2}>
        <View style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.titleCard}>Sản Phẩm Cùng Loại</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MoreProduct", {
                  products: getProductOfTheSameType,
                });
              }}
            >
              <Text style={styles.textShowAll}>
                Xem tất cả{" "}
                <AntDesign name="doubleright" size={13} color="#777" />
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={getProductOfTheSameType}
            renderItem={item.categoryModel.sale == 0 ? renderItem2 : renderItem}
            keyExtractor={(item) => item.id}
            horizontal={true} // Cho phép cuộn ngang
            showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.screenChild}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <Image
              source={{
                uri: API.BASE_URL_IMAGE + item.categoryModel.storeModel.image,
              }}
              style={styles.imageShop}
            />
            <AntDesign
              name="closecircleo"
              size={30}
              color="#777"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </Modal>

        {/* <CardImage /> */}
        <TouchableOpacity
          style={styles.containerImage}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Image
            contentFit="cover"
            style={styles.sizeImageCardImage}
            source={{
              uri: API.BASE_URL_IMAGE + item.categoryModel.storeModel.image,
            }}
          />
        </TouchableOpacity>
        {/* Info Shop */}
        <CardProfileShop />
        {/*Category Of Product */}
        <CardCategoryProduct />
        {/* Product Shop */}
        <CardProductShop />
        {/* Product Of The Same Type */}
        <CardProductOfTheSameType />
        <View style={{ marginBottom: 60 }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageShop: {
    width: 400,
    height: 400,
    marginHorizontal: 20,
    marginVertical: 20,
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
  containerNameShop: {
    width: "100%",
    height: "30%",
    position: "absolute",
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  sizeImageCardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    borderRadius: 3,
  },
  // containerImage: {
  //   width: "100%",
  //   height: "70%",
  //   position: "absolute",
  //   top: 0,
  // },
  textCategory: {
    color: "white",
    fontWeight: "500",
    fontStyle: "italic",
  },
  containerTextCategory: {
    height: 30,
    justifyContent: "center",
    backgroundColor: "green",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  textAddressShop: {
    textAlign: "center",
    color: "#777",
    fontSize: 14,
    fontWeight: "bold",
    // fontStyle: "italic",
    paddingVertical: 1,
    marginHorizontal: 5,
  },
  textEmailShop: {
    textAlign: "center",
    color: "#777",
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "italic",
    paddingVertical: 1,
  },
  containerProfile: {
    marginHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 5,
    borderTopColor: "#fff",
    borderBottomWidth: 5,
    borderBottomColor: "#eee",
  },
  textShowAll: {
    color: "#777",
    fontSize: 13,
    textAlign: "right",
    fontStyle: "italic",
    marginRight: 5,
  },
  titleCard: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "left",
    fontStyle: "italic",
    marginLeft: 10,
  },
  sizeImage: {
    width: "100%",
    height: 180,
    position: "absolute",
    top: 27,
    padding: 10,
  },
  containerImage: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  screenChild: {
    flex: 1,
    marginTop: 41,
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  price2: {
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
  formComment: {
    width: "95%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginBottom: 55,
  },
  textComment: {
    fontSize: 14,
    fontWeight: "300",
    color: "#777",
    marginTop: 10,
    fontStyle: "italic",
    marginHorizontal: 10,
  },
  boxText: {
    paddingHorizontal: 10,
  },
  boxTop: {
    width: "95%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 10,
    alignItems: "center",
  },
  boxComment: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    paddingVertical: 10,
    borderTopWidth: 5,
    borderColor: "#eee",
  },
  commentTop: {
    paddingHorizontal: 10,
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price2: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
    // textDecorationLine: "line-through",
    fontStyle: "italic",
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#777",
    marginTop: 10,
    fontStyle: "italic",
  },
  container: {
    width: "100%",
    height: "100%",
  },
  box: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  main2: {
    width: "100%",
    height: 320,
    borderTopWidth: 5,
    borderColor: "#eee",
  },
  main3: {
    width: "100%",
    height: 50,
  },
  itemRender: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 165,
    height: 250,
    borderWidth: 1.5,
    borderColor: "#eee",
    borderRadius: 3,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  text: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    fontWeight: "bold",
    fontStyle: "italic",
    paddingVertical: 1,
    alignContent: "center",
    width: "100%",
  },
  price: {
    color: "#777",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Store;
