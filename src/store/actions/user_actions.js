import axios from "axios";
import {
  SIGN_IN,
  SIGN_UP,
  AUTO_SIGN_IN,
  SIGN_IN_WITH_FACEBOOK,
  SIGN_IN_WITH_GOOGLE,
  SEND_RESET_PASSWORD_MAIL,
  UPDATE_USER_DETAILS,
  REGISTER_FOR_PUSH_NOTIFICATIONS
} from "../types";
import {
  FIREBASE_API,
  facebookConfig,
  googleConfig,
  firebaseDB
} from "../../libs/config";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import { emailToKey } from "../../libs/helper";
import * as firebase from "firebase";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

export const signUp = async data => {
  try {
    const request = {
      method: "POST",
      url: FIREBASE_API.SIGN_UP,
      data: {
        email: data.email,
        password: data.password,
        returnSecureToken: true
      },
      header: {
        "Content-Type": "application/json"
      }
    };
    const response = await axios(request);
    await addUserInDatabase(data, "native");
    return {
      type: SIGN_UP,
      payload: {
        idToken: response.data.idToken,
        localId: response.data.localId,
        refreshToken: response.data.refreshToken,
        email: data.email
      }
    };
  } catch (error) {
    return {
      type: SIGN_UP,
      payload: error
    };
  }
};

export const signIn = async data => {
  try {
    const request = {
      method: "POST",
      url: FIREBASE_API.SIGN_IN,
      data: {
        email: data.email,
        password: data.password,
        returnSecureToken: true
      },
      header: {
        "Content-Type": "application/json"
      }
    };
    const response = await axios(request);
    return {
      type: SIGN_IN,
      payload: {
        idToken: response.data.idToken,
        localId: response.data.localId,
        refreshToken: response.data.refreshToken,
        email: data.email
      }
    };
  } catch (error) {
    return {
      type: SIGN_IN,
      payload: error
    };
  }
};
export const autoSignIn = async refreshToken => {
  try {
    const request = {
      method: "POST",
      url: FIREBASE_API.REFRESH,
      data: "grant_type=refresh_token&refresh_token=" + refreshToken,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    const response = await axios(request);
    return {
      type: AUTO_SIGN_IN,
      payload: response.data
    };
  } catch (error) {
    return {
      type: AUTO_SIGN_IN,
      payload: error
    };
  }
};
export const signInWithFacebook = async () => {
  try {
    await Facebook.initializeAsync(facebookConfig.APP_ID);
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile", "email"]
    });
    if (type === "success") {
      const credential = await firebase.auth.FacebookAuthProvider.credential(
        token
      );
      return firebase
        .auth()
        .signInWithCredential(credential)
        .then(result => {
          if (result.additionalUserInfo.isNewUser) {
            addUserInDatabase(result.user.providerData[0], "facebook");
          }
          return {
            type: SIGN_IN_WITH_FACEBOOK,
            payload: {
              isNewUser: result.additionalUserInfo.isNewUser,
              accessToken: result.user.refreshToken,
              uid: result.user.uid,
              email: result.user.email,
              refreshToken: result.user.refreshToken
            }
          };
        })
        .catch(err => {
          console.log(err);
          return {
            type: SIGN_IN_WITH_FACEBOOK,
            payload: {
              error:
                "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address."
            }
          };
        });
    } else {
      console.log("user cancel in facebook");
    }
  } catch (error) {
    console.log(error);
    return {
      type: SIGN_IN_WITH_FACEBOOK,
      payload: {
        error: "Failed to login with facebook"
      }
    };
  }
};
export const signInWithGoogle = async () => {
  try {
    const result = await Google.logInAsync({
      androidClientId: googleConfig.androidClientId,
      iosClientId: googleConfig.iosClientId,
      scopes: ["profile", "email"]
    });
    if (result.type === "success") {
      const credential = await firebase.auth.GoogleAuthProvider.credential(
        result.idToken,
        result.accessToken
      );
      return firebase
        .auth()
        .signInWithCredential(credential)
        .then(result1 => {
          if (result1.additionalUserInfo.isNewUser) {
            addUserInDatabase(result1.user.providerData[0], "google");
          }
          return {
            type: SIGN_IN_WITH_GOOGLE,
            payload: {
              isNewUser: result1.additionalUserInfo.isNewUser,
              accessToken: result.idToken,
              uid: result1.user.uid,
              email: result1.user.email,
              refreshToken: result.refreshToken
            }
          };
        })
        .catch(err => {
          console.log(err);
          return {
            type: SIGN_IN_WITH_GOOGLE,
            payload: {
              error:
                "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address."
            }
          };
        });
    } else {
      console.log("user cancel google login");
    }
  } catch (error) {
    console.log(error);
    return {
      type: SIGN_IN_WITH_GOOGLE,
      payload: { error: "failed to login with google" }
    };
  }
};
export const sendResetPasswordMail = async data => {
  try {
    const request = {
      method: "POST",
      url: FIREBASE_API.RESET_PASSWORD,
      data: {
        email: data.email,
        requestType: "PASSWORD_RESET"
      },
      header: {
        "Content-Type": "application/json"
      }
    };
    await axios(request);
    return {
      type: SEND_RESET_PASSWORD_MAIL,
      payload: {
        success: true,
        message:
          "An email has been sent. Plese check the email to reset your password"
      }
    };
  } catch (error) {
    return {
      type: SEND_RESET_PASSWORD_MAIL,
      payload: {
        success: false,
        message: "Email does not exists"
      }
    };
  }
};
export const updateUserDetails = async data => {
  // update user health card number and address in db
  try {
    await updateUserInDatabase(data);
    return {
      type: UPDATE_USER_DETAILS,
      payload: {
        success: true,
        message: "user details are updated"
      }
    };
  } catch (error) {
    return {
      type: UPDATE_USER_DETAILS,
      payload: {
        success: false,
        message: "failed to update user details"
      }
    };
  }
};
export const registerForPushNotifications = async email => {
  try {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return {
        type: REGISTER_FOR_PUSH_NOTIFICATIONS,
        payload: {
          success: false,
          message: "user did not grant permissions"
        }
      };
    }
    // Get the token that uniquely identifies this device
    const token = await Notifications.getExpoPushTokenAsync();
    if (token) {
      await updateUserDetails({ email, token });
    } else {
      console.log("no token");
    }
    return {
      type: REGISTER_FOR_PUSH_NOTIFICATIONS,
      payload: {
        success: true,
        message: "user is registered for push notifications"
      }
    };
  } catch (error) {
    console.log(error);
    return {
      type: REGISTER_FOR_PUSH_NOTIFICATIONS,
      payload: {
        success: false,
        message: "failed to register for push notification"
      }
    };
  }
};
export const addUserInDatabase = (user, provider) => {
  const data = { email: user.email, provider: provider };
  if (user.photoUrl || user.photoURL) {
    data["profile_picture"] = user.photoUrl || user.photoURL;
  }
  if (user.name || user.displayName) {
    const fullNameArr = user.name
      ? user.name.split(" ")
      : user.displayName.split(" ");
    data["first_name"] = fullNameArr[0];
    data["last_name"] = fullNameArr[1];
  }
  return firebaseDB
    .collection("users")
    .doc(emailToKey(user.email))
    .set(data, { merge: true });
};
export const updateUserInDatabase = user => {
  return firebaseDB
    .collection("users")
    .doc(emailToKey(user.email))
    .update(user);
};

export const findUserInDatabase = email => {
  return firebaseDB
    .collection("users")
    .doc(emailToKey(email))
    .get();
};
