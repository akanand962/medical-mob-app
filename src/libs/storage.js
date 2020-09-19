import { AsyncStorage } from "react-native";

export const setItems = async values => {
  try {
    if(!values.email){
      values.email = await this.getEmail();
    }
    await AsyncStorage.multiSet([
      ["@pharmawize@token", values.token],
      ["@pharmawize@refreshToken", values.refreshToken],
      ["@pharmawize@uid", values.uid],
      ["@pharmawize@email", values.email]
    ]);
    return true;
  } catch (error) {
    return error;
  }
};

export const getItems = async () => {
  try {
    const result = await AsyncStorage.multiGet([
      "@pharmawize@token",
      "@pharmawize@refreshToken",
      "@pharmawize@uid",
      "@pharmawize@email"
    ]);
    return result;
  } catch (error) {
    return error;
  }
};
export const removeItems = async () => {
  try {
    const result = await AsyncStorage.multiRemove([
      "@pharmawize@token",
      "@pharmawize@refreshToken",
      "@pharmawize@uid",
      "@pharmawize@email"
    ]);
    return result;
  } catch (error) {
    return error;
  }
};
export const getRefreshToken = async () => {
  try {
    const result = AsyncStorage.getItem("@pharmawize@refreshToken");
    return result;
  } catch (error) {
    return error;
  }
};
export const getEmail = async () => {
  try {
    return AsyncStorage.getItem("@pharmawize@email");
  } catch (error) {
    return error;
  }
};