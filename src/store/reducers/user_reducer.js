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

export default function(state = {}, action) {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        auth: {
          email: action.payload.email || false,
          token: action.payload.idToken || false,
          uid: action.payload.localId || false,
          refreshToken: action.payload.refreshToken || false,
          error: !action.payload.idToken
            ? action.payload.response.data.error.message
            : null
        }
      };
    case SIGN_UP:
      return {
        ...state,
        auth: {
          isNewUser: true,
          email: action.payload.email || false,
          token: action.payload.idToken || false,
          uid: action.payload.localId || false,
          refreshToken: action.payload.refreshToken || false,
          error: !action.payload.idToken
            ? action.payload.response.data.error.message
            : null
        }
      };
    case AUTO_SIGN_IN:
      return {
        ...state,
        auth: {
          token: action.payload.id_token || false,
          uid: action.payload.user_id || false,
          refreshToken: action.payload.refresh_token || false
        }
      };
    case SIGN_IN_WITH_FACEBOOK:
      return {
        ...state,
        auth: {
          isNewUser: action.payload.isNewUser || false,
          email: action.payload.email || false,
          token: action.payload.accessToken || false,
          uid: action.payload.uid || false,
          refreshToken: action.payload.refreshToken || false,
          error: action.payload.error || false
        }
      };
    case SIGN_IN_WITH_GOOGLE:
      return {
        ...state,
        auth: {
          isNewUser: action.payload.isNewUser || false,
          email: action.payload.email || false,
          token: action.payload.accessToken || false,
          uid: action.payload.uid || false,
          refreshToken: action.payload.refreshToken || false,
          error: action.payload.error || false
        }
      };
    case SEND_RESET_PASSWORD_MAIL:
      return {
        ...state,
        info: {
          success: action.payload.success,
          message: action.payload.message || false
        }
      };
      case UPDATE_USER_DETAILS:
      return {
        ...state,
        info: {
          success: action.payload.success,
          message: action.payload.message || false
        }
      };
      case REGISTER_FOR_PUSH_NOTIFICATIONS:
      return {
        ...state,
        info: {
          success: action.payload.success,
          message: action.payload.message || false
        }
      };
    default:
      return state;
  }
}
