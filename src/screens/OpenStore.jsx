// Update v1.0

import { useEffect, useState } from "react";
import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { API } from "../services";
import Loading from "../components/Loading";

const OpenStore = ({ navigation }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState("");
  const [avatar, setAvatar] = useState(API.BASE_URL_IMAGE + "ic_image.png");

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
  }, []);

  //Loading
  if (loading) return <Loading />;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageName(result.assets[0].uri);
      setAvatar(result.assets[0].uri);
    }
  };

  const submitForm = () => {
    const formInfo = new FormData();
    formInfo.append("name", name);
    formInfo.append("email", email);
    formInfo.append("phone", phoneNumber);
    formInfo.append("address", address);
    formInfo.append("file", {
      uri: imageName,
      name: imageName.split("/").pop(),
      type: "image/jpeg",
    });

    imageName &&
      name &&
      email &&
      phoneNumber &&
      address &&
      API.addStore(formInfo),
      navigation.replace("Profile");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.containerImage}>
            <TouchableOpacity onPress={() => pickImage()}>
              <Image
                style={styles.imageIcon}
                contentFit="cover"
                source={{ uri: avatar }}
              />
            </TouchableOpacity>

            <Text
              style={styles.textTitleStore}
              numberOfLines={2}
              ellipsizeMode="middle"
            >
              Thông Tin Cửa Hàng
            </Text>
            <AntDesign name="edit" size={24} color="#fff" />
          </View>
          <View style={styles.inputGroup}>
            <AntDesign
              name="user"
              size={24}
              color="#777"
              style={{ marginLeft: 10 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Tên Cửa Hàng"
              placeholderTextColor="#777"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputGroup}>
            <MaterialCommunityIcons
              name="email-edit-outline"
              size={24}
              color="#777"
              style={{ marginLeft: 10 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputGroup}>
            <MaterialCommunityIcons
              name="phone"
              size={24}
              color="#777"
              style={{ marginLeft: 10 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Số Điện Thoại"
              placeholderTextColor="#777"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <View style={styles.inputGroup}>
            <FontAwesome
              name="address-card"
              size={24}
              color="#777"
              style={{ marginLeft: 10 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa Chỉ"
              placeholderTextColor="#777"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={() => {submitForm()}}>
            <Text style={styles.buttonText}>Yêu Cầu </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textTitleStore: {
    fontStyle: "italic",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#fff",
  },
  containerImage: {
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 20,
    position: "relative",
    backgroundColor: "#777",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    width: "30%",
    height: 40,
    backgroundColor: "green",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 100,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  input: {
    color: "#777",
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 14,
    fontStyle: "italic",
  },
  inputGroup: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    width: "90%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 20,
  },
  OpenStoreChild: {
    width: "100%",
    height: 200,
    backgroundColor: "green",
    borderRadius: 10,
    marginTop: 35,
    alignItems: "center",
  },
  imageIcon: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
});

export default OpenStore;
