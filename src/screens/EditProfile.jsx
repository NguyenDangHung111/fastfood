// Update v1.0
import { useEffect, useState } from "react";
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
import {
  MaterialCommunityIcons,
  FontAwesome,
  AntDesign,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { API } from "../services";
import Loading from "../components/Loading";
import History from './History';

const EditProfile = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageName, setImageName] = useState("");
  const [avatar, setAvatar] = useState("");

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
    API.detailAccount()
      .then((data) => {
        setAvatar(API.BASE_URL_IMAGE + data.image);
        setUsername(data.username);
        setEmail(data.email);
        setPhoneNumber(data.phone);
        setAddress(data.address);
        setLoading(false);
      })
      .catch(() => {
        navigation.navigate("Login");
        logout();
      });
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

  async function updateInfo() {
    const formInfo = new FormData();
    formInfo.append("username", username);
    formInfo.append("email", email);
    formInfo.append("phone", phoneNumber);
    formInfo.append("address", address);
    formInfo.append("file", {
      uri: imageName,
      name: imageName.split("/").pop(),
      type: "image/jpeg",
    });

    await API.updateAccount(formInfo)
      .then(() => {
        navigation.replace("Profile");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.screen}>
        <View style={styles.boxInformation}>
          <View style={styles.boxAvatar}>
            <TouchableOpacity onPress={() => pickImage()}>
              <Image
                style={styles.imageIcon}
                contentFit="cover"
                source={{ uri: avatar }}
              />
            </TouchableOpacity>

            <Text
              style={styles.textBoxAvatar}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              Chỉnh Sửa Thông Tin
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
              placeholder="Tên"
              placeholderTextColor="#777"
              value={username}
              onChangeText={setUsername}
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

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              updateInfo();
            }}
          >
            <Text style={styles.buttonText}>Cập nhật </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textBoxAvatar: {
    fontStyle: "italic",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#fff",
  },
  boxAvatar: {
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 20,
    position: "relative",
    backgroundColor: "green",
    width: "100%",
  },
  boxInformation: {
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
  editProfileChild: {
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
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
});

export default EditProfile;
