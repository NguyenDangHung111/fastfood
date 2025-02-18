// Update v1.0
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { API } from "../services";
import io from "socket.io-client";
import { format } from "date-fns";

const now = new Date();
const formattedDateTime = format(now, "HH:mm dd-MM-yyyy ");
const socket = io("http://" + API.IP + ":3000");

const ChatStore = ({ navigation, route }) => {
  const { store } = route.params;
  const [loading, setLoading] = useState(false);
  const [ask, setAsk] = useState("");
  const [user, setUser] = useState("");
  const [conversation, setConversation] = useState([
    {
      id: 0,
      imageStore: store.image,
      message: "Chào Bạn! Chúng tôi có thể giúp gì cho Bạn ?",
      typeMessage: "text",
      time: formattedDateTime,
      sender: "store",
    },
  ]);
  const [idAccount, setIdAccount] = useState("");
  


  useEffect(() => {
    if (API.getToken != null) {
      API.getChat(store.id).then((res) => {
        setConversation((prevConversation) => [
          ...prevConversation,
          ...res.map((item, index) => ({
            ...item,
            id: index + 1,
          })),
        ]);
      });
    } else {
      navigation.navigate("Login");
    }

    API.detailAccount()
      .then((data) => {
        setUser(data);
        if (data.image != null) {
          setLoading(false);
        }
      })
      .catch(() => {
        API.logout();
        navigation.replace("Login");
      });

    API.getIdAccount()
      .then((data) => {
        setIdAccount(data);
        console.log(data);
        if (idAccount != null) {
          socket.emit('join_store', {userId:data});
        }
      })
      .catch(() => {
        API.logout();
        navigation.replace("Login");
      })

    socket.on("receive_message", (data) => {
      const updatedData = {
        id: new Date().getTime(),
        time: formattedDateTime,
        message: data.message,
        typeMessage: data.typeMessage,
        sender: data.sender,
        imageStore: store.image,
        imageUser: user.image,
      };

      setConversation((prevConversation) => [...prevConversation, updatedData]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  async function run($ask) {
    const message = {
      id: conversation.length + 1,
      imageUser: user.image,
      time: formattedDateTime,
      message: $ask,
      typeMessage: "text",
      sender: "user",
    };

    setConversation([...conversation, message]);

    socket.emit("send_message", {
      imageUser: user.image,
      imageStore: store.image,
      time: formattedDateTime,
      message: $ask,
      typeMessage: "text",
      idAccount: idAccount,
      idStore: store.id,
      sender: "user",
      receiver: store.id
    });

    setAsk("");
    handleNewMessage();
  }

  const MessageUser = ({ item }) => {
    return (
      <View style={styles.viewMessageUser}>
        <Text style={styles.textMessageUser}>{item.message}</Text>
        <View style={styles.viewImage}>
          <Image
            source={{ uri: API.BASE_URL_IMAGE + item.imageUser }}
            style={styles.sizeImage}
          />
          <Text style={styles.textTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  const MessageModel = ({ item }) => {
    return (
      <View style={styles.viewMessageModel}>
        <View style={styles.viewImage}>
          <Image
            source={{ uri: API.BASE_URL_IMAGE + item.imageStore }}
            style={styles.sizeImage}
          />
          <Text style={styles.textTime}>{item.time}</Text>
        </View>
        <Text style={styles.textMessageModel}>{item.message}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.boxChat}>
      {item.sender === "user" ? (
        <MessageUser item={item} />
      ) : (
        <MessageModel item={item} />
      )}
    </View>
  );

  const flatListRef = useRef(null);

  const handleNewMessage = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.viewChat}>
        <FlatList
          ref={flatListRef}
          data={conversation}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.containerChat}
        />
      </View>

      {/* <BoxSearch /> */}
      <View style={styles.containerSearch}>
        <View style={styles.viewSearch}>
          <TextInput
            placeholder="Bạn muốn hỏi gì ? "
            placeholderTextColor={"#777"}
            value={ask}
            onChangeText={setAsk}
            style={styles.inputSearch}
          />
        </View>

        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            run(ask);
            Keyboard.dismiss();
          }}
          style={{
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            width: "10%",
            marginHorizontal: 10,
            backgroundColor: "green",
            padding: 10,
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <FontAwesome name="send" size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textTime: {
    fontSize: 6,
    fontWeight: "500",
    fontStyle: "italic",
    textAlign: "left",
    color: "#777",
    // marginTop: 5
  },
  textMessageModel: {
    marginLeft: 10,
    fontWeight: "500",
    fontStyle: "italic",
    textAlign: "left",
    color: "#777",
    width: "90%",
  },
  sizeImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  viewImage: {
    width: 45,
    height: 45,
    // borderRadius: 50,
    // borderColor: "#ccc",
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textMessageUser: {
    marginHorizontal: 10,
    fontWeight: "500",
    // fontStyle: "italic",
    textAlign: "left",
    color: "#777",
  },
  viewMessageUser: {
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginRight: "-5%",
    paddingLeft: 20,
  },
  viewMessageModel: {
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  boxChat: {
    flexDirection: "row",
    marginHorizontal: 10,
    padding: 10,
    width: "90%",
  },
  inputSearch: {
    width: "90%",
    height: "99%",
    marginHorizontal: 3,
    borderColor: "#777",
    backgroundColor: "#eee",
    color: "#777",
  },
  viewSearch: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: 40,
    backgroundColor: "#eee",
  },
  containerSearch: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: 50,
    marginBottom: 60,
  },
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  viewChat: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
    backgroundColor: "#fff",
    marginTop: 0,
    width: "100%",
  },
  containerChat: {
    width: "100%",
    marginTop: 50,
    backgroundColor: "#fff",
  },
});

export default ChatStore;
