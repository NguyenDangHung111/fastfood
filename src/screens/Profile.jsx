// Update v1.0

import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API } from "../services";
import Loading from "../components/Loading";

const Profile = ({ navigation }) => {
  const [DATA, setDATA] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.detailAccount()
      .then((data) => {
        setDATA(data);
        if(data.image != null) {
          setLoading(false);
        }
      })
      .catch(() => {
        API.logout();
        navigation.replace("Login");
      });
  }, []);

  //Loading
  if (loading) return <Loading />;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screenChild}>
        <ScrollView style={styles.containerScroll}>
          {/* <CardProfile /> */}
          <View style={styles.profile1}>
            <Image
              style={styles.imageProfile}
              contentFit="cover"
              source={{ uri: API.BASE_URL_IMAGE + DATA.image }}
            />
            <View style={styles.info}>
              <View style={styles.info1}>
                <SimpleLineIcons name="user" size={24} color="white" />
                <Text
                  style={styles.text}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {DATA.username}
                </Text>
              </View>
              <View style={styles.info1}>
                <MaterialCommunityIcons name="email" size={24} color="white" />
                <Text
                  style={styles.text}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {DATA.email}
                </Text>
              </View>
              <View style={styles.info1}>
                <MaterialCommunityIcons name="phone" size={24} color="white" />
                <Text
                  style={styles.text}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {DATA.phone == null ? "chưa cập nhật" : DATA.phone}
                </Text>
              </View>
            </View>
          </View>

          {/* <CardListOption /> */}
          <View style={styles.container}>
            {DATA.permission == 3 ? (
              <TouchableOpacity
                style={styles.content}
                onPress={() => navigation.navigate("Shipper")}
              >
                <Image
                  style={styles.image}
                  contentFit="cover"
                  source={require("../assets/profile/icons8-truck-100.png")}
                />
                <Text style={styles.textContent}>Vận Chuyển</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={30}
                  color="#8d9a9b"
                  style={styles.icon}
                />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.content}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Image
                style={styles.image}
                contentFit="cover"
                source={require("../assets/profile/icons8-individual-64.png")}
              />
              <Text style={styles.textContent}>Cá Nhân</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={30}
                color="#8d9a9b"
                style={styles.icon}
              />
            </TouchableOpacity>

            {DATA.permission == 2 ? (
              <TouchableOpacity
                style={styles.content}
                onPress={() => {navigation.navigate("OpenStore")}}
              >
                <Image
                  style={styles.image}
                  contentFit="cover"
                  source={require("../assets/profile/free.png")}
                />
                <Text style={styles.textContent}>Đối Tác - Mở Cửa Hàng</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={30}
                  color="#8d9a9b"
                  style={styles.icon}
                />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.buttonLogOut}
              onPress={() => {
                API.logout();
                navigation.replace("Login");
              }}
            >
              <View style={styles.buttonLogOut}>
                <Text style={styles.textLogOut}>Đăng Xuất</Text>
                <MaterialCommunityIcons name="logout" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textLogOut: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 10,
  },
  icon: {
    position: "absolute",
    right: 0,
  },
  containerScroll: {
    marginTop: 35,
  },
  screenChild: {
    flex: 1,
    marginHorizontal: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: 30,
    height: 30,
  },
  container: {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  content: {
    width: "100%",
    height: 50,
    borderLeftWidth: 5,
    borderLeftColor: "dodgerblue",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  buttonLogOut: {
    display: "flex",
    flexDirection: "row",
    width: 130,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "red",
  },
  textContent: {
    fontSize: 15,
    color: "#8d9a9b",
    marginLeft: 10,
    fontStyle: "italic",
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    marginLeft: 10,
    marginRight: 20,
    fontStyle: "italic",
    fontWeight: "bold",
    
  },
  info1: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  info: {
    width: 250,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  profile1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "dodgerblue",
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
  },
  imageProfile: {
    marginLeft: 40,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#fff",
  },
});

export default Profile;
