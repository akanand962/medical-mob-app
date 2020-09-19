import React from "react";
import { Platform, Text, Animated, Easing } from "react-native";

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from "react-navigation-tabs";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import OrdersScreen from "../screens/OrdersScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

import UploadScreen from "../screens/addOrder/UploadScreen";
import SelectPharmacyScreen from "../screens/addOrder/SelectPharmacyScreen";
import UpdateDetailScreen from "../screens/UpdateDetailsScreen"; 
import OrderConfirmationScreen from "../screens/addOrder/OrderConfirmationScreen"
import OrderNumberScreen from "../screens/addOrder/OrderNumberScreen"


import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Map from "../components/Map";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "white"
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary
};

///transition for stack navigator
const transitionCustomConfig = () => {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps;

      const thisSceneIndex = scene.index;
      const width = layout.initWidth;

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        outputRange: [width, 0, 0]
      });

      return { transform: [{ translateX }] };
    }
  };
};

const HomeNavigator = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    OrderDetailScreen: OrderDetailScreen,
    UploadScreen: UploadScreen,
    SelectPharmacyScreen: SelectPharmacyScreen,
    OrderConfirmationScreen: OrderConfirmationScreen,
    OrderNumberScreen: OrderNumberScreen,
    Map:Map
  },
  {
    defaultNavigationOptions: defaultNavOptions,
    transitionConfig: transitionCustomConfig
  }
);

///makes tab bar go away when detail screen pops up
// HomeNavigator.navigationOptions = ({navigation}) => {
//     let routeName = navigation.state.routes[navigation.state.index].routeName;
//     let tabBarVisible = true

//     if ( routeName !== 'HomeScreen') {
//         tabBarVisible = false
//     }

//     return {
//         tabBarVisible,
//     }
// }

const OrdersNavigator = createStackNavigator(
  {
    OrdersScreen: OrdersScreen,
    OrderDetailScreen: OrderDetailScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const ProfileNavigator = createStackNavigator(
  {
    ProfileScreen: ProfileScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const AuthNavigation = createStackNavigator(
  {
    ForgotPassword: {
      screen:ForgotPasswordScreen
    },
    Login: {
      screen:LoginScreen,
    },
    UpdateUser:{
      screen:UpdateDetailScreen
    }
  },{
    initialRouteName:'Login',
    defaultNavigationOptions: defaultNavOptions,
    headerMode: "none"
  }
);

const AppTabNavigator = createMaterialTopTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return (
            <Ionicons name="ios-home" size={25} color={tabInfo.tintColor} />
          );
        },
        tabBarLabel: "Home"
        //tabBarColor: Colors.primary
      }
    },
    Orders: {
      screen: OrdersNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return (
            <Ionicons name="ios-cart" size={25} color={tabInfo.tintColor} />
          );
        },
        tabBarLabel: "Orders"
        //tabBarColor: Colors.primary
      }
    },
    Profile: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return (
            <Ionicons name="md-contact" size={25} color={tabInfo.tintColor} />
          );
        },
        tabBarLabel: "Profile"
        //tabBarColor: Colors.primary
      }
    }
  },
  {
   // lazy:true,
    tabBarPosition: "bottom",
    tabBarOptions: {
      activeTintColor: "white",
      inactiveTintColor: "#ccc",
      style: {
        backgroundColor: Colors.primary
      },
      showIcon: true,
      indicatorStyle: {
        backgroundColor: "white"
      }
    }
  }
);

const AppNavigator = () => {
  return createAppContainer(
    createSwitchNavigator(
      {
        App: AppTabNavigator,
        Auth: AuthNavigation
      },
      {
        initialRouteName: "Auth"
      }
    )
  );
};

export default AppNavigator;
