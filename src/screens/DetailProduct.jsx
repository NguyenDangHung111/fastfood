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
  TextInput,
  Button,
  alert,
  Platform,
} from "react-native";

import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  AntDesign,
  MaterialIcons,
  Entypo,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { API } from "../services";
import Loading from "../components/Loading";

const DetailProduct = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  const [detailProduct, setDetailProduct] = useState({});
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  //list comment
  const [comments, setComments] = useState([]);
  //show Image
  const [modalVisible, setModalVisible] = useState(false);
  // show box comment
  const [commentVisible, setCommentVisible] = useState(false);
  const [image, setImage] = useState("");
  //comment
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [imageComment, setImageComment] = useState(
    API.BASE_URL_IMAGE + "ic_image.png"
  );
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Yêu cầu truy cập Hình ảnh");
        }
      }
    })();

    API.productOfTheSameType(item.categoryModel.id).then((data) => {
      setProduct(
        data.filter(
          (item) => item.categoryModel.status === 0 && item.status === 0
        )
      );
    });

    API.getProductDetail(item.id)
      .then((data) => {
        setDetailProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });

    API.getComment(item.id).then((data) => {
      setComments(data);
    });
  }, []);

  //Loading
  if (loading) return <Loading />;

  function HandleClick(index) {
    const newRating = index === rating ? 0 : index;
    setRating(newRating);
  }

  function QuantityStar() {
    if (comments.length == 0) return "0";
    let sum = 0;
    for (let i = 0; i < comments.length; i++) {
      sum += comments[i].star;
    }
    return " " + sum / comments.length;
  }

  const RenderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => HandleClick(i)}>
          <AntDesign
            name="star"
            size={25}
            color={i <= rating ? "#FFBA49" : "#eee"}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const add = async (id_store, id_product) => {
    setLoading(true);
    try {
      const cartItems = await API.listProductInCart(0);
      const isProductInCart = cartItems.some(
        (cartItem) => cartItem.productModel.id === id_product
      );

      if (isProductInCart) {
        setLoading(false);
        navigation.navigate("Cart");
        return;
      }

      const orderData = await API.addOrder(id_store);
      API.addOrderItem(orderData, id_product, 1);

      setLoading(false);
      navigation.navigate("Cart");
    } catch (error) {
      console.log("add: " + error);
      setLoading(false);
      navigation.navigate("Stack5");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageComment(result.assets[0].uri);
      setImageName(result.assets[0].uri.split("/").pop());
    }
  };

  const submitComment = async () => {
    try {
      const formData = new FormData();
      formData.append("idProduct", detailProduct.id);
      formData.append("comment", comment);
      formData.append("star", rating);
      formData.append("file", {
        uri: imageComment,
        name: imageName,
        type: "image/jpeg",
      });
      const response = await API.addComment(formData);
      if (response) {
        setCommentVisible(false);
        API.getComment(item.id).then((data) => {
          setComments(data);
        });
      }
    } catch (error) {
      console.warn("submitComment: " + error);
      navigation.navigate("Stack5");
    }
  };

  function convertValue(value) {
    return parseFloat(value.replace(",", "."));
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemRender}
      onPress={() => navigation.replace("DetailProduct", { item })}
    >
      <View style={styles.viewImageItem}>
        <Image
          contentFit="cover"
          source={{ uri: API.BASE_URL_IMAGE + item.image }}
          style={styles.sizeImageItem}
        />
      </View>
      <View style={styles.viewSale}>
        <Text style={styles.textSale}>
          {"-" + item.categoryModel.sale + "%"}
        </Text>
      </View>
      <View style={styles.viewInformationStore}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.name} -<Entypo name="shop" size={13} color="green" />{" "}
          {item.categoryModel.storeModel.name}
        </Text>
        <Text style={styles.price2}>Giá: {item.price} VNĐ </Text>

        <Text style={styles.discount}>
          Chỉ còn:{" "}
          {(
            convertValue(item.price) -
            (item.categoryModel.sale * convertValue(item.price)) / 100
          )
            .toFixed(3)
            .replace(".", ",") + " VNĐ"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderItemSale = ({ item }) => (
    <TouchableOpacity
      style={styles.itemRender}
      onPress={() => navigation.replace("DetailProduct", { item })}
    >
      <View style={styles.viewImageItem}>
        <Image
          contentFit="cover"
          source={{ uri: API.BASE_URL_IMAGE + item.image }}
          style={styles.sizeImageItem}
        />
      </View>

      <View style={styles.viewInformationStore}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.name} -<Entypo name="shop" size={13} color="green" />{" "}
          {item.categoryModel.storeModel.name}
        </Text>
        <Text style={styles.price2}>Giá: {item.price} VNĐ </Text>
      </View>
    </TouchableOpacity>
  );

  const RenderStar = ({ star }) => {
    const stars = [];

    for (let i = 0; i < star; i++) {
      stars.push(<AntDesign key={i} name="star" size={14} color="#FFBA49" />);
    }

    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  const ListComment = ({ data }) => {
    if (data.length == 0)
      return (
        <View style={styles.boxComment}>
          <Text style={styles.textComment}>Chưa có bình luận nào </Text>
        </View>
      );
    return (
      <View>
        {data.map((item, index) => (
          <View key={index} style={styles.boxComment}>
            <View style={styles.boxTop}>
              <Image
                source={{
                  uri: API.BASE_URL_IMAGE + item.accountModel.image,
                }}
                style={styles.sizeImageComment}
              />
              <View style={styles.boxText}>
                <Text style={styles.textNameUser}>
                  {item.accountModel.username}
                </Text>
                <View style={styles.viewStar}>
                  <RenderStar star={item.star} />
                </View>
              </View>
              <Text style={styles.textDateComment}>{item.created_at}</Text>
            </View>
            <Text style={styles.textComment}>{item.comment}</Text>

            {item.image && (
              <TouchableOpacity
                onPress={() => {
                  setImage(item.image), setModalVisible(true);
                }}
              >
                <Image
                  source={{ uri: API.BASE_URL_IMAGE + item.image }}
                  style={styles.imageComment}
                />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    );
  };

  const CardImageProduct = () => {
    return (
      <TouchableOpacity
        style={styles.boxImageProduct}
        onPress={() => {
          setImage(item.image), setModalVisible(true);
        }}
      >
        <Image
          contentFit="cover"
          style={styles.sizeImageProduct}
          source={{
            uri: API.BASE_URL_IMAGE + detailProduct.image,
          }}
        />
      </TouchableOpacity>
    );
  };

  const CardInformationStore = () => {
    return (
      <View style={styles.boxInformationStore}>
        <Text style={styles.text}>
          {" "}
          <Image
            style={styles.sizeIconCheck}
            contentFit="cover"
            source={require("../assets/icons/check2.png")}
          />{" "}
          {detailProduct.categoryModel.sale != 0
            ? detailProduct.name +
              " - Giảm: " +
              detailProduct.categoryModel.sale +
              "%"
            : detailProduct.name}
        </Text>
        <Text style={styles.text} numberOfLines={1}>
          <Entypo name="shop" size={18} color="green" />{" "}
          {detailProduct.categoryModel.storeModel.name} -{" "}
          <Entypo name="old-phone" size={18} color="green" />{" "}
          {detailProduct.categoryModel.storeModel.phone}
        </Text>
        <View style={styles.boxPriceProduct}>
          <Text style={styles.price}>
            {detailProduct.categoryModel.sale != 0
              ? "Giá chỉ còn: " +
                (
                  convertValue(detailProduct.price) -
                  (convertValue(detailProduct.price) *
                    detailProduct.categoryModel.sale) /
                    100
                )
                  .toFixed(3)
                  .replace(".", ",") +
                "VNĐ"
              : "Giá: " + detailProduct.price.replace(".", ",") + " VNĐ"}
          </Text>
          <Text style={styles.textStar}>Đánh Giá:{QuantityStar()} </Text>
          <AntDesign name="star" size={19} color="#FFBA49" />
          {/* Add product to cart */}
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              add(detailProduct.categoryModel.storeModel.id, detailProduct.id);
            }}
          >
            <MaterialIcons name="add-box" size={24} color="orange" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CardProductTheSameType = () => {
    return (
      <View style={styles.main2}>
        <View style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.textProductTheSameType}>
              Sản Phẩm Cùng Loại
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MoreProduct", { products });
              }}
            >
              <Text style={styles.textShowAll}>
                Xem tất cả{" "}
                <AntDesign name="doubleright" size={13} color="#777" />
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={products}
            renderItem={
              item.categoryModel.sale == 0 ? renderItemSale : renderItem
            }
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
              source={{ uri: API.BASE_URL_IMAGE + image }}
              style={styles.sizeImage}
            />
            <AntDesign
              name="closecircleo"
              size={30}
              color="#777"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </Modal>
        <CardImageProduct />
        <CardInformationStore />
        <CardProductTheSameType />
        <View style={{ width: "100%", height: 100 }}>
          <View style={styles.commentTop}>
            <Text style={styles.text}>Bình Luận & Đánh Giá</Text>
          </View>
          <View style={styles.commentTop}>
            <Text style={{ fontWeight: "600" }}>
              {comments.length} bình luận
            </Text>
            <TouchableOpacity
              onPress={() => {
                setCommentVisible(true);
              }}
            >
              <Text style={styles.textReview}>
                <FontAwesome5 name="pen" size={14} color="white" /> Bình luận
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={commentVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.formComment}>
                <Text style={styles.textFormReview}>ĐÁNH GIÁ</Text>
                <View style={styles.viewStar}>
                  <RenderStars />
                </View>
                <TextInput
                  placeholder="Hãy cho tôi biết cảm nhận của bạn ! "
                  value={comment}
                  onChangeText={setComment}
                  style={styles.textInput}
                />
                <TouchableOpacity onPress={pickImage}>
                  <Image
                    source={{ uri: imageComment }}
                    style={styles.imageReview}
                  />
                </TouchableOpacity>

                <Button
                  title="Bình luận"
                  color="green"
                  onPress={() => {
                    submitComment();
                  }}
                />
              </View>
              <Ionicons
                name="close-circle-outline"
                size={40}
                color="#fff"
                style={{ marginVertical: 10 }}
                onPress={() => {
                  {
                    setCommentVisible(false),
                      setComment(""),
                      setImageComment(API.BASE_URL_IMAGE + "ic_image.png"),
                      setRating(5);
                  }
                }}
              />
            </View>
          </Modal>
        </View>

        <View style={styles.boxListComment}>
          <ListComment data={comments} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenChild: {
    flex: 1,
    marginTop: 41,
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  boxListComment: {
    width: "100%",
    marginBottom: 60,
    marginTop: 10,
  },
  imageReview: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  textInput: {
    width: "90%",
    height: 40,
    color: "#777",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontSize: 13,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 10,
    textAlign: "center",
  },
  viewStar: {
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  textFormReview: {
    fontWeight: "600",
    fontSize: 18,
    color: "#777",
    fontStyle: "italic",
  },
  textReview: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    width: 110,
  },
  textShowAll: {
    color: "#777",
    fontSize: 13,
    textAlign: "right",
    fontStyle: "italic",
    marginRight: 10,
  },
  textProductTheSameType: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "left",
    fontStyle: "italic",
    marginLeft: 10,
  },
  textStar: {
    fontSize: 14,
    color: "#777",
    marginLeft: 10,
    paddingVertical: 2,
  },
  boxPriceProduct: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 10,
    textAlign: "center",
  },
  sizeIconCheck: {
    width: 30,
    height: 30,
  },
  boxInformationStore: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#eee",
  },
  sizeImageProduct: {
    width: "100%",
    height: 300,
    position: "absolute",
    top: 0,
    padding: 10,
  },
  boxImageProduct: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  imageComment: {
    width: 90,
    height: 90,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  textDateComment: {
    color: "#777",
    fontSize: 12,
    fontStyle: "italic",
    position: "absolute",
    right: 0,
  },
  viewStar: {
    display: "flex",
    flexDirection: "row",
  },
  textNameUser: {
    fontWeight: "bold",
    color: "#777",
  },
  sizeImageComment: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "#eee",
    borderWidth: 1,
  },
  textComment: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 15,
    color: "#777",
  },
  viewInformationStore: {
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
  viewSale: {
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
  viewImageItem: {
    width: "100%",
    height: "70%",
    position: "absolute",
    top: 0,
  },
  sizeImageItem: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    borderRadius: 3,
  },
  sizeImage: {
    width: 400,
    height: 400,
    marginHorizontal: 20,
    marginVertical: 20,
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
    fontSize: 16,
    fontWeight: "bold",
    fontStyle: "italic",
    paddingVertical: 1,
  },
  price: {
    color: "#777",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DetailProduct;
