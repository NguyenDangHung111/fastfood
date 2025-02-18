import { NavigationContainer } from "@react-navigation/native";
import { View, Text, Image } from "react-native";
import {
  Order,
  History,
  Home,
  Profile,
  Signup,
  Login,
  Otp,
  EditProfile,
  DetailProduct,
  Cart,
  MoreProduct,
  ChatAI,
  Store,
  Shipper,OpenStore,ChatStore
} from "./src/screens";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();
const screenStack = {
  tabBarShowLabel: false,
  headerShown: false,
  animation: "slide_from_right",
  animationDuration: 10,
};

const Stack1 = () => (
  <Stack.Navigator screenOptions={screenStack} initialRouteName="Home">
    <Stack.Screen name="Cart" component={Cart} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="MoreProduct" component={MoreProduct} />
    <Stack.Screen name="DetailProduct" component={DetailProduct} />
    <Stack.Screen name="Store" component={Store} />
    <Stack.Screen name="ChatStore" component={ChatStore} />
  </Stack.Navigator>
);

const Stack5 = () => (
  <Stack.Navigator screenOptions={screenStack} initialRouteName="Login">
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="Otp" component={Otp} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
    <Stack.Screen name="Shipper" component={Shipper} />
    <Stack.Screen name="OpenStore" component={OpenStore} />
  </Stack.Navigator>
);

const Tab = createBottomTabNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevations: 0,
    height: 55,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions} initialRouteName="Stack1">
        <Tab.Screen
          name="Stack1"
          component={Stack1}
          options={{
            // unmountOnBlur: true,
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 10,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 15,
                  }}
                >
                  <Image
                    source={require("./src/assets/icons/icons8-home-30.png")}
                  />
                  <Text
                    style={{
                      fontWeight: focused ? "800" : "400",
                      color: focused ? "green" : "#777",
                      fontSize: 12,
                    }}
                  >
                    Trang Chủ
                  </Text>
                </View>
              );
            },
          }}
        />

        <Tab.Screen
          name="Order"
          component={Order}
          options={{
            unmountOnBlur: true,
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 10,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 15,
                  }}
                >
                  <Image
                    source={require("./src/assets/icons/icons8-list-30.png")}
                  />
                  <Text
                    style={{
                      fontWeight: focused ? "800" : "400",
                      color: focused ? "green" : "#777",
                      fontSize: 12,
                    }}
                  >
                    Đơn Hàng
                  </Text>
                </View>
              );
            },
          }}
        />

        <Tab.Screen
          name="History"
          component={History}
          options={{
            unmountOnBlur: true,
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 10,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 15,
                  }}
                >
                  <Image
                    source={require("./src/assets/icons/icons8-history-30.png")}
                  />
                  <Text
                    style={{
                      fontWeight: focused ? "800" : "400",
                      color: focused ? "green" : "#777",
                      fontSize: 12,
                    }}
                  >
                    Lịch Sử
                  </Text>
                </View>
              );
            },
          }}
        />

        <Tab.Screen
          name="ChatAI"
          component={ChatAI}
          options={{
            
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 10,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 15,
                  }}
                >
                  <Image source={require("./src/assets/icons/icons8-ai-35.png")} />
                  <Text
                    style={{
                      fontWeight: focused ? "800" : "400",
                      color: focused ? "green" : "#777",
                      fontSize: 12,
                    }}
                  >
                    Bot AI
                  </Text>
                </View>
              );
            },
          }}
        />

        <Tab.Screen
          name="Stack5"
          component={Stack5}
          options={{
            unmountOnBlur: true,
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 10,
            tabBarIcon: ({ focused }) => {
              return (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 15,
                  }}
                >
                  <Image
                    source={require("./src/assets/icons/icons8-account-30.png")}
                  />
                  <Text
                    style={{
                      fontWeight: focused ? "800" : "400",
                      color: focused ? "green" : "#777",
                      fontSize: 12,
                    }}
                  >
                    Tài Khoản
                  </Text>
                </View>
              );
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
