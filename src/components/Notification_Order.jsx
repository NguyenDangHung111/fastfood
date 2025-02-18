import { View, Text, Image, Button } from "react-native";

const OrderNull = ({navigation}) => {
    return (
        <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          marginBottom: 60,
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: "#777",
              fontStyle: "italic",
            }}
          >
           Bạn chưa đặt hàng
          </Text>
          <Image
            source={require("../assets/icons/icons8-cart-100.png")}
            style={{ width: 100, height: 100, marginVertical: 20 }}
          />
          <Button
            title="mua sắm"
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      </View>
    );
}

export default OrderNull;