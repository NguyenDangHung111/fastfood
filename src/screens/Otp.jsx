//Update v1.0

import { View, Text, Image, TextInput, StyleSheet, Alert } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { API } from "../services";

const Otp = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", ""]); // Lưu trữ giá trị của từng ô OTP
  const inputRefs = useRef([...Array(4)].map(() => React.createRef())); // Tạo một mảng refs cho từng ô OTP
  const [timeLeft, setTime] = useState(120); // Thời gian ban đầu là 120 giây (2 phút)

  useEffect(() => {
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      API.checkOtp(otpValue)
        .then((isValid) => {
          if (isValid) {
            navigation.navigate("Home");
          } else {
            navigation.replace("Signup");
            Alert.alert("Nhắc nhở", "Sai OTP");
          }
        })
        .catch((error) => {
          console.error("OTP check error:", error);
          navigation.navigate("Signup");
        });
    }

    const focusNextInput = (index) => {
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].current.focus(); // Chuyển focus sang ô tiếp theo nếu có
      }
    };

    const index = otp.findIndex((value) => value === ""); // Tìm ô OTP đầu tiên chưa được điền
    if (index !== -1) {
      inputRefs.current[index].current.focus(); // Focus vào ô đó
    }

    // Khi giá trị của ô OTP thay đổi, tự động chuyển sang ô tiếp theo
    const currentIndex = index === -1 ? inputRefs.current.length - 1 : index;
    if (otp[currentIndex] !== "") {
      focusNextInput(currentIndex);
    }

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(interval); // Dừng bộ đếm khi thời gian còn lại là 0
        }
        return prevTime > 0 ? prevTime - 1 : 0; // Giảm thời gian còn lại mỗi giây
      });
    }, 1000);

    return () => clearInterval(interval); // Hủy bộ đếm khi component unmount
  }, [otp]);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  // Chuyển đổi thời gian còn lại thành chuỗi định dạng phút:giây
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={styles.containerImage}>
          <Image
            source={require("../assets/ic_logo_app.png")}
            style={styles.sizeImage}
          />
        </View>

        <View style={styles.containerOtp}>
          <Text style={styles.textTitle}>Nhập mã xác thực !</Text>

          <View style={styles.containerInput}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={inputRefs.current[index]}
                style={styles.input}
                onChangeText={(text) => handleChangeText(text, index)}
                value={value}
                maxLength={1}
                keyboardType="numeric"
                autoFocus={index === 0}
                selectTextOnFocus={true}
              />
            ))}
          </View>

          <Text style={styles.textTime}>
            Mã xác thực sẽ hết hạn sau : {formatTime(timeLeft)}
          </Text>
          <Text style={styles.textTitleChild}>
            *Lưu ý: Không chia sẽ mã này với bất kì ai
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textTitleChild: {
    marginTop: 10,
    color: "red",
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 14,
  },
  textTime: {
    marginTop: 20,
    color: "red",
    textAlign: "center",
  },
  containerInput: {
    width: "80%",
    height: 60,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
    color: "red",
    textAlign: "center",
    fontStyle: "italic",
  },
  containerOtp: {
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeImage: {
    width: 150,
    height: 150,
    marginLeft: -20,
  },
  containerImage: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    width: "15%",
    height: "70%",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    textAlign: "center",
    fontSize: 18,
  },
});
export default Otp;
