// Update v1.0

import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import Button from "../components/Button";
import { API } from "../services";
import Loading from "../components/Loading";

const Login = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    API.detailAccount()
      .then((data) => {
        if (data.image) {
          navigation.replace("Profile");
        }
      })
      .catch(() => {
        API.logout();
        navigation.replace("Login");
      });
  }, []);

  if (loading) return <Loading />;

  const validateEmail = () => {
    // Biểu thức chính quy để kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(email)) {
      return true;
    } else {
      Alert.alert("Nhắc nhở", "Email không đúng định dạng");
      navigation.replace("Login");
    }
  };

  const validatePassword = () => {
    // Biểu thức chính quy để kiểm tra mật khẩu
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (passwordPattern.test(password)) {
      return true;
    } else {
      Alert.alert(
        "Nhắc nhở ",
        "Mật khẩu tối thiểu 8 kí tự bao gồm: In hoa, chữ thường, số và kí tự đặc biệt"
      );
    }
  };

  const handleLogin = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      if (validateEmail()) {
        if (validatePassword()) {
          if (API.login(email, password)) {
            setLoading(false);
            Alert.alert("Thông Báo", "Đăng nhập thành công");
            navigation.navigate("Home");
          } else {
            Alert.alert(
              "Thông Báo",
              "Sai Tài Khoản Hoặc Mật Khẩu Hoặc Đã Bị Khóa"
            );
            navigation.replace("Login");
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
            source={require("../assets/icons/google.png")}
            style={styles.imageSocial}
            resizeMode="contain"
          />
          <Text style={styles.textSocial}>Tiếp tục với Google</Text>
        </TouchableOpacity>
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

  const CardMovetoSignup = () => {
    return (
      <View style={styles.containerMove}>
        <Text style={styles.textMove}>Chưa có tài khoản ? </Text>
        <Pressable onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.textSignUp}>Đăng ký</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <ScrollView style={{ backgroundColor: COLORS.white }}>
      <View style={styles.screen}>
        <CardLogo />
        {/* <CardInputEmail /> */}
        <View style={styles.containerInput}>
          <Text style={styles.textTitleInput}>Email</Text>

          <View style={styles.lineInput}>
            <Ionicons
              name="mail"
              size={24}
              color="#8d9a9b"
              style={styles.iconInput}
            />

            <TextInput
              placeholder="Nhập email của bạn ! "
              placeholderTextColor={COLORS.grey}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
            />
          </View>
        </View>

        {/* <CardInputPassword /> */}
        <View style={styles.containerInput}>
          <Text style={styles.textTitleInput}>Mật khẩu</Text>

          <View style={styles.lineInput}>
            <Fontisto
              name="locked"
              size={24}
              color="#8d9a9b"
              style={styles.iconInput}
            />
            <TextInput
              placeholder="Nhập mật khẩu !"
              placeholderTextColor={COLORS.grey}
              secureTextEntry={!isPasswordShown}
              value={password}
              onChangeText={setPassword}
              style={styles.textInput}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={styles.iconShowPassword}
            >
              {isPasswordShown == false ? (
                <Ionicons name="eye" size={24} color="#8d9a9b" />
              ) : (
                <Ionicons name="eye-off" size={24} color="#8d9a9b" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* <CardForgotPassword /> */}
        <View style={styles.containerForgotPassword}>
          <Text style={styles.textForgotPassword}>Quên mật khẩu ?</Text>
        </View>

        <Button
          title="Tiếp tục"
          onPress={handleLogin}
          filled
          style={styles.buttonSubmit}
        />

        <CardOr />
        <CardButtonSocial />
        <CardMovetoSignup />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 55,
    flexDirection: "column",
    justifyContent: "row",
  },
  containerLogo: {
    justifyContent: "center",
    alignItems: "center",
  },
  sizeImage: {
    width: 150,
    height: 140,
    marginLeft: -20,
  },
  containerInput: {
    marginVertical: 5,
  },
  textTitleInput: {
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 8,
    color: "#8d9a9b",
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
  iconInput: {
    position: "absolute",
    left: 12,
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
  containerForgotPassword: {
    flexDirection: "row",
    marginTop: 10,
    bottom: 8,
  },
  textForgotPassword: {
    position: "absolute",
    right: 7,
    color: "#8d9a9b",
  },
  buttonSubmit: {
    marginTop: 20,
    backgroundColor: "#fac125cb",
    height: 55,
  },
  containerOr: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
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
    height: 20,
  },
  containerSocial: {
    flexDirection: "column",
    justifyContent: "row",
    height: 0,
  },
  buttonSocial: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.grey,
    marginRight: 4,
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
  containerMove: {
    marginTop: 130,
    flexDirection: "row",
    justifyContent: "center",
    height: 30,
  },
  textMove: {
    fontSize: 16,
    color: "#8d9a9b",
    height: 30,
  },
  textSignUp: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "bold",
    fontStyle: "italic",
    marginLeft: 6,
    height: 30,
  },
});

export default Login;
