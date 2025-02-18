// Update v1.0

import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { API } from "../services";
import {
  Ionicons,
  FontAwesome6,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign
} from "@expo/vector-icons";
import Loading from "../components/Loading";

const Shipper = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  const [DATA1, setData1] = useState([]);
  const [DATA2, setData2] = useState([]);
  const [DATA3, setData3] = useState([]);
  const [DATA4, setData4] = useState([]);


  const [selectedButton, setSelectedButton] = useState(1);
  const [container, setContainer] = useState([]);
  const [commentVisible, setCommentVisible] = useState(false);
  const PRODUCT_IS_SHIPPING = 2;
  const PRODUCT_IS_DELIVERED = 3;
  const PRODUCT_CANCELED = 4;

  useEffect(() => {
    //List Order
    API.listOrderForShipper(PRODUCT_IS_SHIPPING)
      .then((data) => {
        setData1(data);
        setContainer(data);
        // setLoading(false);
      })
      .catch(() => {
        navigation.navigate("Login");
      });

    //List Order of shipper
    API.listOrderOfShipper(PRODUCT_IS_SHIPPING)
      .then((data) => {
        setData2(data);
        // setLoading(false);
      })
      .catch(() => {
        navigation.navigate("Login");
      });

      //List Order Delivered
    API.listOrderOfShipper(PRODUCT_IS_DELIVERED)
    .then((data) => {
      setData3(data);
      // setLoading(false);
    })
    .catch(() => {
      navigation.navigate("Login");
    });

    //List Order Canceled
    API.listOrderOfShipper(PRODUCT_CANCELED)
    .then((data) => {
      setData4(data);
      setLoading(false);
    })
    .catch(() => {
      navigation.navigate("Login");
    });
  }, []);

  //Loading
  if (loading) return <Loading />;

  function handleCancel(item) {
    setLoading(true);
    API.updateStatusOrder(item.orderModel.id, PRODUCT_CANCELED);
    API.listOrderForShipper(PRODUCT_IS_SHIPPING)
      .then((data) => {
        setData1(data);
        setContainer(data);
        setLoading(false);
      })
      .catch(() => {
        navigation.navigate("Login");
      });
    setLoading(true);
    API.listOrderOfShipper(PRODUCT_IS_SHIPPING)
      .then((data) => {
        setData2(data);
        setLoading(false);
      })
      .catch(() => {
        navigation.navigate("Login");
      });
  }

  async function handleDeliver(item) {
    if (await API.updateStatusOrder(item.orderModel.id, PRODUCT_IS_DELIVERED)) {
      await API.listOrderForShipper(PRODUCT_IS_SHIPPING)
        .then((data) => {
          setData1(data);
        })
        .catch(() => {
          navigation.navigate("Login");
        });

      await API.listOrderOfShipper(PRODUCT_IS_SHIPPING)
        .then((data) => {
          setData2(data);
          setContainer(DATA2);
          setLoading(false);
        })
        .catch(() => {
          navigation.navigate("Login");
        });
    }
  }

  async function handleGetOrder(item) {
    if (API.updateStatusOrder(item.orderModel.id, PRODUCT_IS_SHIPPING)) {
      await API.listOrderForShipper(PRODUCT_IS_SHIPPING)
        .then((data) => {
          setData1(data);
          setContainer(DATA1);
          setLoading(false);
        })
        .catch(() => {
          navigation.navigate("Login");
        });

      await API.listOrderOfShipper(PRODUCT_IS_SHIPPING)
        .then((data) => {
          setData2(data);
          setLoading(false);
        })
        .catch(() => {
          navigation.navigate("Login");
        });
    }
  }

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
                style={styles.textPriceProduct}
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
                  Thanh Toán:{" "}
                  {parseFloat(item.quantity * item.price)
                    .toFixed(3)
                    .replace(".", ",")}{" "}
                  VNĐ
                </Text>
                {selectedButton == 3 || selectedButton == 4 ?(
                  <Text style={styles.Text}> Tình Trạng: . . .</Text>
                )  : (
                  <Text style={styles.Text}> Tình Trạng: chưa ai nhận</Text>
                )}
             
              </View>
              <View
                style={{
                  width: "85%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: selectedButton === 1 ? "space-evenly" : "space-between",
                  alignItems: "center",
                  height: 40,
                }}
              >
                {selectedButton === 2 ? (
                  <Button
                    title="Hủy"
                    onPress={() => {
                      setLoading(true);
                      handleCancel(item);
                    }}
                  />
                ) : null}

                {selectedButton == 3 || selectedButton == 4 ? (<View style={{width: 0,height:2}}></View>) : null}

                <Button
                  title="Thông Tin"
                  onPress={() => {
                    setCommentVisible(true);
                  }}
              
                />
                
                {selectedButton == 3 || selectedButton == 4 ? null : (
                   <Button
                  title={selectedButton === 1 ? "Nhận Đơn" : "Đã Giao"}
                  onPress={() => {
                    setLoading(true);
                    if (selectedButton === 1) {
                      handleGetOrder(item);
                    } else if(selectedButton === 2) {
                      handleDeliver(item);
                    }
                  }}
                />
                )}
               
              </View>
            </View>
            {/* PopUp Info */}
            <Modal
              animationType="fade"
              transparent={true}
              visible={commentVisible}
            >
              <View style={styles.centeredView}>
                <View style={styles.formComment}>
                  <Text style={styles.textTitle}>
                    Thông Tin thêm{" "}
                    <MaterialCommunityIcons
                      name="information"
                      size={18}
                      color="#777"
                    />
                  </Text>
                  <View style={styles.form}>
                    <Text style={styles.Text}>
                      <FontAwesome5 name="user-alt" size={18} color="green" />
                      {" Khách Hàng: " +
                        item.orderModel.accountModel.username}{" "}
                    </Text>
                    <Text style={styles.Text}>
                      <FontAwesome5 name="running" size={19} color="green" />
                      {" Địa Chỉ: " + item.orderModel.accountModel.address}{" "}
                    </Text>
                    <Text style={styles.Text}>
                      <FontAwesome5 name="phone-alt" size={16} color="green" />
                      {" Số Điện Thoại: " + item.orderModel.accountModel.phone}
                    </Text>
                    <Text style={styles.Text}>
                      <FontAwesome5 name="store" size={16} color="green" />
                      {" Cửa Hàng: " + item.orderModel.storeModel.name}{" "}
                    </Text>
                    <Text style={styles.Text}>
                      <FontAwesome5 name="running" size={19} color="green" />
                      {" Địa Chỉ: " + item.orderModel.storeModel.address}{" "}
                    </Text>
                    <Text style={styles.Text}>
                      <FontAwesome5 name="phone-alt" size={16} color="green" />
                      {" Số Điện Thoại: " + item.orderModel.storeModel.phone}
                    </Text>
                  </View>
                  <Button
                    title="Đóng"
                    color="red"
                    onPress={() => {
                      setCommentVisible(false);
                    }}
                  />
                </View>
              </View>
            </Modal>
          </View>
        ))}
      </View>
    );
  };

  const handleSelectButton = (buttonNumber) => {
    setSelectedButton(buttonNumber);
    switch (buttonNumber) {
      case 1:
        setSelectedButton(1);
        setContainer(DATA1);
        break;
      case 2:
        setSelectedButton(2);
        setContainer(DATA2);
        break;
      case 3:
        setSelectedButton(3);
        setContainer(DATA3);
        break;
      case 4:
        setSelectedButton(4);
        setContainer(DATA4);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.screen}>
      {/* <CardBoxButton /> */}
      <View style={styles.containerButton}>
        <View style={styles.containerButtonChild}>
          <TouchableOpacity
            onPress={() => {
              handleSelectButton(1);
            }}
            style={[styles.button, { opacity: selectedButton === 1 ? 1 : 0.5 }]}
          >
            <Text style={styles.textButton}>
              <FontAwesome6 name="people-carry-box" size={16} color="#fff" /> Chọn Đơn Hàng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleSelectButton(2);
            }}
            style={[styles.button, { opacity: selectedButton === 2 ? 1 : 0.5 }]}
          >
            <Text style={styles.textButton}>
              <FontAwesome5 name="shipping-fast" size={16} color="#fff" /> Đơn
              Hàng Cần Giao
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerButtonChild}>
          <TouchableOpacity
            onPress={() => {
              handleSelectButton(3);
            }}
            style={[styles.button, { opacity: selectedButton === 3 ? 1 : 0.5 }]}
          >
            <Text style={styles.textButton}>
              <AntDesign name="gift" size={16} color="#fff" />  Đơn Hàng Đã Giao 
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleSelectButton(4);
            }}
            style={[styles.button, { opacity: selectedButton === 4 ? 1 : 0.5 }]}
          >
            <Text style={styles.textButton}>
              <FontAwesome5 name="boxes" size={16} color="#fff" /> Đơn
              Hàng Đã Hủy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.box1}>
        <ListOrder data={container} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 160,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "green",
    borderRadius: 5,
  },
  textTitle: {
    fontWeight: "600",
    fontSize: 18,
    color: "#777",
    fontStyle: "italic",
  },
  textPriceProduct: {
    width: "100%",
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "bold",
    color: "#777",
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
  textButton: {
    fontSize: 13,
    fontWeight: "500",
    color: "#fff",
    fontStyle: "italic",
    textAlign: "center",
  },
  containerButton: {
    display: "flex",
    flexDirection: "column",
    height: 100,
    marginTop: 41,
    marginBottom: 5,
  },
  containerButtonChild: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 50,
    display: "flex",
    flexDirection: "column",
  },
  form: {
    width: "95%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "center",
    // backgroundColor: "#eee",
    padding: 10,
  },
  formComment: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
    marginBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  Text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#777",
    fontStyle: "italic",
    padding: 5,
  },
  box1: {
    flex: 1,
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
    // height: 100,
    borderTopWidth: 5,
    borderColor: "#eee",
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
});

export default Shipper;
