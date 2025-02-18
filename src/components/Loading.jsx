import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

 const Loading = () => {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="green" />
      <Text style={styles.text}>Đang tải...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    fontStyle: "italic",
  },
});

export default Loading;