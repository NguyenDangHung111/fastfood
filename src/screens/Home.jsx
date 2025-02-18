// Update v1.0

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import TextTicker from "react-native-text-ticker";
import Swiper from "react-native-swiper";
import { API } from "../services";

const Home = ({ navigation }) => {
  // Dữ liệu sản phẩm mẫu
  const [products, setProduct] = useState([]);
  const [countProduct, setCountProduct] = useState([]);
  const [banner, setBanner] = useState([]);
  const PRODUCT_IN_CART = 0;
  const UNLOCKED = 0;

  useEffect(() => {
    API.getProducts().then((data) => {
      setProduct(
        data.filter(
          (item) =>
            item.categoryModel.status === UNLOCKED && item.status === UNLOCKED
        )
      );
    });

    API.getBanner().then((data) => {
      setBanner(data);
    });

    API.listProductInCart(PRODUCT_IN_CART)
      .then((data) => {
        setCountProduct(data);
      })
      .catch(() => {
        setCountProduct([]);
      });
  }, []);

  // Render mỗi item trong danh sách sản phẩm
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemRender}
      onPress={() => navigation.navigate("Store", { item })}
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
      <View style={styles.containerProduct}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.name} -<Entypo name="shop" size={13} color="green" />{" "}
          {item.categoryModel.storeModel.name}
        </Text>
        <Text style={styles.price}>Giá: {item.price} VNĐ </Text>
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

  const CustomList = ({ data }) => {
    return (
      <View>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.itemRender2}
            onPress={() => navigation.navigate("Store", { item })}
          >
            <Image
              contentFit="cover"
              source={{ uri: API.BASE_URL_IMAGE + item.image }}
              style={styles.imageProduct}
            />
            <View style={styles.containerProductOther}>
              <Text
                style={styles.textProduct}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                <Ionicons name="shield-checkmark" size={13} color="#FFBA49" />{" "}
                {item.name}
                {" - "}
                <Entypo name="shop" size={13} color="green" />{" "}
                {item.categoryModel.storeModel.name}
              </Text>
              <Text style={styles.price}>Giá: {item.price} VNĐ </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const CardCart = () => {
    return (
      <TouchableOpacity
        style={styles.cart}
        onPress={() => (
          API.listProductInCart(PRODUCT_IN_CART)
            .then((data) => {
              setCountProduct(data);
            })
            .catch((error) => {
              // console.log(error);
            }),
          navigation.navigate("Cart")
        )}
      >
        <MaterialIcons name="shopping-cart" size={24} color="#777" />

        {countProduct.length == 0 ? null : countProduct.length > 99 ? (
          <Text style={styles.textQuantity}>99+</Text>
        ) : (
          <Text style={styles.textQuantity}>{countProduct.length}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const CardSearch = () => {
    return (
      <View style={styles.search}>
        <TextTicker
          style={styles.marqueeText}
          duration={120000} // Thời gian di chuyển từ trái sang phải
          loop
          bounce
          repeatSpacer={50} // Khoảng cách giữa các lần lặp lại
          marqueeDelay={1} // Thời gian chờ trước khi bắt đầu lặp lại
        >
          {banner.map((item, index) => (
            <Text style={styles.marqueeText} key={index}>
              {item.text}
            </Text>
          ))}
        </TextTicker>
      </View>
    );
  };

  const CardSlideShow = () => {
    return (
      <View style={styles.header}>
        {/* slide show Image */}
        <View style={styles.header2}>
          <Swiper autoplay={true} autoplayTimeout={4}>
            {banner.map((item, index) => (
              <View key={index} style={styles.slide}>
                <Image
                  style={styles.img}
                  contentFit="cover"
                  source={{
                    uri: API.BASE_URL_IMAGE + item.image,
                  }}
                />
              </View>
            ))}
          </Swiper>
        </View>
        <View style={styles.header3}></View>
      </View>
    );
  };

  const CardCategory = () => {
    return (
      <View style={styles.category}>
        <View style={styles.itemMain1}>
          <Image
            style={styles.imgMain1}
            contentFit="cover"
            source={require("../assets/fun/discount.png")}
          />
          <Image
            style={styles.imgMain1}
            contentFit="cover"
            source={require("../assets/fun/drink.png")}
          />
          <Image
            style={styles.imgMain1}
            contentFit="cover"
            source={require("../assets/fun/fast.png")}
          />
          <Image
            style={styles.imgMain1}
            contentFit="cover"
            source={require("../assets/fun/free.png")}
          />
        </View>
        <View style={styles.itemMain1}>
          <Image
            style={styles.imgMain1}
            contentFit="cover"
            source={require("../assets/fun/free0.png")}
          />
          <Image
            style={styles.imgMain1}
            contentFit="cover"
            source={require("../assets/fun/marke.png")}
          />
          <Image
            style={styles.imgMain1}
            contentFit="cover"
            source={require("../assets/fun/noodle.png")}
          />
          <Image
            style={styles.imgMain1}
            contentFit="cover"
            source={require("../assets/fun/rice.png")}
          />
        </View>
      </View>
    );
  };

  const CardSaleProduct = () => {
    return (
      <View style={styles.main2}>
        <View style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.textTitleCard}>🔥 Sản Phẩm Giảm Giá 🔥</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MoreProduct", {
                  products: products.filter(
                    (item) => item.categoryModel.sale > 0
                  ),
                });
              }}
            >
              <Text style={styles.textShowAll}>
                {"Xem tất cả "}
                <AntDesign name="doubleright" size={13} color="#777" />
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={products.filter((item) => item.categoryModel.sale > 0)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal={true} // Cho phép cuộn ngang
            showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
          />
        </View>
      </View>
    );
  };

  const CardDrink = () => {
    return (
      <View style={styles.main2}>
        <View style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.textTitleCard}>☕️ 🍵 Đồ Uống 🥤 🧋</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MoreProduct", {
                  products: products.filter(
                    (item) => item.categoryModel.category == "Nước"
                  ),
                });
              }}
            >
              <Text style={styles.textShowAll}>
                {"Xem tất cả "}
                <AntDesign name="doubleright" size={13} color="#777" />
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={products.filter(
              (item) => item.categoryModel.category == "Nước"
            )}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal={true} // Cho phép cuộn ngang
            showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
          />
        </View>
      </View>
    );
  };

  const CardDish = () => {
    return (
      <View style={styles.main2}>
        <View style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.textTitleCard}>🥗 🍝 Món Ăn 🍔 🥪</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MoreProduct", {
                  products: products.filter(
                    (item) =>
                      item.categoryModel.category != "Nước" &&
                      item.categoryModel.sale != 0
                  ),
                });
              }}
            >
              <Text style={styles.textShowAll}>
                {"Xem tất cả "}
                <AntDesign name="doubleright" size={13} color="#777" />
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={products.filter(
              (item) =>
                item.categoryModel.category != "Nước" &&
                item.categoryModel.sale != 0
            )}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal={true} // Cho phép cuộn ngang
            showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
          />
        </View>
      </View>
    );
  };

  const CardOtherProduct = () => {
    return (
      <View style={styles.main3}>
        <View style={styles.box}>
          <Text style={styles.textTitleCard}>Sản Phẩm khác</Text>
        </View>
        <CustomList
          data={products.filter((item) => item.categoryModel.sale == 0)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.header, styles.containerHeader]}>
        <View style={styles.header1}>
          <CardSearch />
          <CardCart />
        </View>
      </View>

      <View style={styles.body}>
        <ScrollView style={styles.scrollBody}>
          <CardSlideShow />
          <CardCategory />
          <CardSaleProduct />
          <CardDrink />
          <CardDish />
          <CardOtherProduct />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textShowAll: {
    color: "#777",
    fontSize: 13,
    textAlign: "right",
    fontStyle: "italic",
    marginRight: 5,
  },
  textTitleCard: {
    color: "orange",
    fontWeight: "500",
    fontSize: 15,
    textAlign: "left",
    fontStyle: "italic",
    marginLeft: 10,
  },
  scrollBody: {
    width: "100%",
    height: "100%",
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerHeader: {
    marginTop: 30,
    backgroundColor: "#003A25",
  },
  textQuantity: {
    color: "white",
    marginVertical: 3,
    fontSize: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingVertical: 3,
    backgroundColor: "green",
    borderRadius: 50,
    fontWeight: "bold",
  },
  textProduct: {
    width: "100%",
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#777",
  },
  containerProductOther: {
    marginLeft: 10,
    display: "flex",
    flexDirection: "column",
  },
  imageProduct: {
    width: 60,
    height: 60,
  },
  containerProduct: {
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
  box: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  imgMain1: {
    width: 50,
    height: 50,
    marginHorizontal: 20,
  },
  itemMain1: {
    width: "100%",
    height: "50%",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  container: {
    width: "100%",
    height: "100%",
  },
  itemRender2: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    height: 75,
    borderTopWidth: 5,
    borderColor: "#eee",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
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
  title: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#777",
    marginTop: 10,
    fontStyle: "italic",
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
  main1: {
    width: "100%",
    height: 150,
    padding: 5,
  },
  category: {
    width: "80%",
    height: 150,
    padding: 5,
    marginHorizontal: 30,
  },
  main2: {
    width: "100%",
    height: 320,
    borderTopWidth: 5,
    borderColor: "#eee",
    marginBottom: 10,
  },
  main3: {
    width: "100%",
    borderTopWidth: 5,
    borderColor: "#eee",
  },
  slide: {
    backgroundColor: "#fff",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  marqueeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#777",
    fontStyle: "italic",
    paddingTop: 3,
    paddingLeft:15
  },
  header3: {
    marginVertical: 1,
    height: 1,
    width: "100%",
  },
  header2: {
    height: 200,
    width: "100%",
    backgroundColor: "white",
    borderColor: "#777",
  },
  cart: {
    width: 60,
    borderWidth: 1,
    height: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#777",
    position: "absolute",
    right: 0,
    marginRight: 10,
  },
  search: {
    borderWidth: 1,
    height: 40,
    width: "75%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#777",
    position: "absolute",
    marginHorizontal: 10,
  },
  header1: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#003A25",
    height: 60,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 5,
  },
  header: {
    width: "100%",
    backgroundColor: "#003A25",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003A25",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    marginBottom: 60,
  },
  item: {
    width: "90%",
    height: "30",
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "blue",
  },
});

export default Home;
