import { View, Text, Image, Button, StyleSheet } from "react-native";

const CartNull = ({navigation}) => {
    return (
        <View style={styles.container}>
          <View
            style={styles.container}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "500",
                color: "#777",
                fontStyle: "italic",
              }}
            >
              Giỏ hàng trống
            </Text>
            <Image
              source={require("../assets/icons/icons8-cart-100.png")}
              style={{ width: 100, height: 100, marginVertical: 20 }}
            />
            <Button title="mua sắm" onPress={() => navigation.navigate("Home")} />
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      },
})
export default CartNull