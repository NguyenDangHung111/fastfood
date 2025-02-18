// Update v1.0

import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import Button from "../components/Button";
import { API } from "../services";
import Loading from "../components/Loading";

const Signup = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  //Loading
  if (loading) return <Loading />;

  const validateEmail = () => {
    // Biểu thức chính quy để kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(email)) {
      return true;
    } else {
      Alert.alert("Nhắc nhở", "Email không đúng định dạng");
      setLoading(false);
    }
  };

  const validatePassword = () => {
    // Biểu thức chính quy để kiểm tra mật khẩu
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (passwordPattern.test(password1) && passwordPattern.test(password2)) {
      return true;
    } else {
      setLoading(false);
      Alert.alert(
        "Nhắc nhở ",
        "Mật khẩu tối thiểu 8 kí tự bao gồm: In hoa, chữ thường, số và kí tự đặc biệt"
      );
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      if (validateEmail()) {
        if (await API.checkEmail(email) == true) {
          setLoading(false);
          Alert.alert("Nhắc nhở", "Email đã tồn tại");
        } else {
          if (validatePassword()) {
            if (password1 === password2) {
              if (await API.createAccount(email, password1) == true) {
                if (await API.sendOtp(email) == true) {
                  setLoading(false);
                  navigation.replace("Otp");
                }
              }
            } else {
              setLoading(false);
              Alert.alert("Thông báo", "Mật khẩu không khớp");
            }
          }
        }
      }
    } catch (error) {
      Alert.alert(
        "Đăng nhập thất bại",
        error.response?.data?.message || error.message || "Unknown error"
      );
    }
  };

  const CardLogo = () => {
    return (
      <View style={styles.containerLogo}>
        <Image
          source={require("../assets/ic_logo_app.png")}
          style={styles.sizeImage}
        />
      </View>
    );
  };

  const CardOr = () => {
    return (
      <View style={styles.containerOr}>
        <View style={styles.line} />
        <Text style={styles.textOr}>Hoặc</Text>
        <View style={styles.line} />
      </View>
    );
  };

  const CardButtonSocial = () => {
    return (
      <View style={styles.containerSocial}>
        <TouchableOpacity
          onPress={() => console.log("Pressed")}
          style={styles.buttonSocial}
        >
          <Image
            source={require("../assets/icons/facebook.png")}
            style={styles.imageSocial}
            resizeMode="contain"
          />

          <Text style={styles.textSocial}>Tiếp tục với Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => console.log("Pressed")}
          style={styles.buttonSocial}
        >
          <Image
            source={require("../assets/icons//google.png")}
            style={styles.imageSocial}
            resizeMode="contain"
          />

          <Text style={styles.textSocial}>Tiếp tục với Google</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CardMovetoLogin = () => {
    return (
      <View style={styles.containerMove}>
        <Text style={styles.textMove}>Tôi đã có tài khoản ?</Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.textLogin}>Đăng nhập</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={{ flex: 1, marginHorizontal: 22, marginTop: 30 }}>
        <CardLogo />
        {/* <CardInputEmail /> */}
        <View>
          <Text style={styles.textTitleInput}>Email</Text>

          <View style={styles.lineInput}>
            <Ionicons
              name="mail"
              size={24}
              color="#8d9a9b"
              style={styles.iconInput}
            />

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Nhập email của bạn ! "
              placeholderTextColor={COLORS.grey}
              keyboardType="email-address"
              style={styles.textInput}
            />
          </View>
        </View>
        {/* <CardInputPasswordTime1 /> */}
        <View>
          <Text style={styles.textTitleInput}>Mật khẩu</Text>

          <View style={styles.lineInput}>
            <Fontisto
              name="locked"
              size={24}
              color="#8d9a9b"
              style={styles.iconInput}
            />
            <TextInput
              value={password1}
              onChangeText={setPassword1}
              placeholder="Nhập mật khẩu !"
              placeholderTextColor={COLORS.grey}
              secureTextEntry={isPasswordShown}
              style={styles.textInput}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={styles.iconShowPassword}
            >
              {isPasswordShown == false ? (
                <Ionicons name="eye-off" size={24} color="#8d9a9b" />
              ) : (
                <Ionicons name="eye" size={24} color="#8d9a9b" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        {/* <CardInputPasswordTime2 /> */}
        <View style={styles.containerInput}>
          <Text style={styles.textTitleInput}>Nhập lại mật khẩu</Text>

          <View style={styles.lineInput}>
            <Fontisto
              name="locked"
              size={24}
              color="#8d9a9b"
              style={styles.iconInput}
            />
            <TextInput
              value={password2}
              onChangeText={setPassword2}
              placeholder="Nhập mật khẩu !"
              placeholderTextColor={COLORS.grey}
              secureTextEntry={isPasswordShown}
              style={styles.textInput}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={styles.iconShowPassword}
            >
              {isPasswordShown == false ? (
                <Ionicons name="eye-off" size={24} color="#8d9a9b" />
              ) : (
                <Ionicons name="eye" size={24} color="#8d9a9b" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Tiếp tục"
          onPress={handleSignup}
          filled
          style={styles.buttonSubmit}
        />
        <CardOr />
        <CardButtonSocial />
        <CardMovetoLogin />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerMove: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  textMove: {
    fontSize: 16,
    color: "#8d9a9b",
  },
  textLogin: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "bold",
    fontStyle: "italic",
    marginLeft: 6,
  },
  containerSocial: {
    flexDirection: "column",
    justifyContent: "row",
  },
  buttonSocial: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 10,
    marginVertical: 5,
  },
  imageSocial: {
    height: 36,
    width: 36,
    marginRight: 8,
  },
  textSocial: {
    color: "#8d9a9b",
    fontStyle: "italic",
    fontWeight: "600",
  },
  containerOr: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.grey,
    marginHorizontal: 10,
  },
  textOr: {
    fontSize: 14,
    color: "#8d9a9b",
  },
  containerInput: {
    marginBottom: 15,
  },
  iconShowPassword: {
    position: "absolute",
    right: 12,
    color: "#8d9a9b",
  },
  textInput: {
    width: "100%",
    left: 20,
  },
  iconInput: {
    position: "absolute",
    left: 12,
  },
  lineInput: {
    width: "100%",
    height: 48,
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 22,
  },
  containerInput: {
    marginBottom: 12,
  },
  textTitleInput: {
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 5,
    color: "#8d9a9b",
  },
  buttonSubmit: {
    marginVertical: 5,
    backgroundColor: "#fac125cb",
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerLogo: {
    justifyContent: "center",
    alignItems: "center",
  },
  sizeImage: {
    width: 150,
    height: 150,
    marginLeft: -20,
  },
});

export default Signup;
