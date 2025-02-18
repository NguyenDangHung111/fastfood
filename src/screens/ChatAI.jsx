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
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { API } from "../services";

const ChatAI = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [askAI, setAskAI] = useState("");
  
  useEffect(() => {
    API.getChatAI().then((res) => {
      setData(res);
    });
  }, []);

  const genAI = new GoogleGenerativeAI(
    "AIzaSyD6W50K90r2pe8e_j9HCvSrAY8jVcvmRTs"
  );

  const [conversation, setConversation] = useState([
    {
      id: 0,
      role: "model",
      text: "Chào bạn! Tôi là Trợ lý AI. Tôi có thể giúp gì cho Bạn bây giờ ?",
    },
  ]);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 0.5,
    topP: 0.5,
    topK: 64,
    maxOutputTokens: 1000,
    responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  async function run($askAI) {
    setLoading(true);
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: data.flatMap(({ trainer, model }) => [
        {
          role: "user",
          parts: [{ text: trainer }],
        },
        {
          role: "model",
          parts: [{ text: model }],
        },
      ]),
    });

    const result = (await chatSession.sendMessage($askAI)).response.text();

    setConversation([
      ...conversation,
      { id: conversation.length + 1, role: "user", text: $askAI },
      {
        id: conversation.length + 2,
        role: "model",
        text: result,
      },
    ]);
    handleNewMessage();
  }

  const MessageUser = ({item}) => {
    return (
      <View style={styles.viewMessageUser}>
        <Text style={styles.textMessageUser}>{item.text}</Text>
        <View style={styles.viewImage}>
          <Image
            source={require("../assets/icons/icons8-account-30.png")}
            style={styles.sizeImage}
          />
        </View>
      </View>
    );
  };

  const MessageModel = ({item}) => {
    return (
      <View style={styles.viewMessageModel}>
        <View style={styles.viewImage}>
          <Image
            source={require("../assets/icons/icons8-ai-35.png")}
            style={styles.sizeImage}
          />
        </View>
        <Text style={styles.textMessageModel}>{item.text}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.boxChat}>
      {item.role === "user" ? (
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
            value={askAI}
            onChangeText={setAskAI}
            style={styles.inputSearch}
          />
        </View>

        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            run(askAI);
            setAskAI("");
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

export default ChatAI;
