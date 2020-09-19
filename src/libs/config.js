import * as firebase from "firebase";
import "firebase/firestore";

//import {getItems} from "../libs/storage"

// let token = null;
// getItems().then((result)=>{
//   token = result[0][1];
//   console.log(result)
//   console.log(token)
// })

const firebaseConfig = {
  apiKey: "AIzaSyASm2VxdI89vh6v5GNRJJ_EjCIG4m6xxGM",
  authDomain: "pharmawize-dev.firebaseapp.com",
  databaseURL: "https://pharmawize-dev.firebaseio.com",
  projectId: "pharmawize-dev",
  //storageBucket: "pharmawize-dev.appspot.com",
  messagingSenderId: "934971820678",
  appId: "1:934971820678:web:84c11b9104c52341511f07",
  storageBucket: "gs://pharmawize-dev-prescription",
  serverKey:"AAAA2bCpyoY:APA91bGfD5VBdGenHFk3WDlsBKVbsOo0_G3QViGGBs0WiWwGrCVvRD0YmMcsDYPp8cSZlSxzcLBm61T0XMx_5j8pZ-4ToJ9GgV7PAwKRjxQHP3TD1_iF6cv3f1DRADdruql06YIrJsGD"
};

const FIREBASE_API = {
  FIREBASE_URL: `${firebaseConfig.databaseURL}`,
  SIGN_UP: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
  SIGN_IN: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
  REFRESH: `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
  RESET_PASSWORD: `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${firebaseConfig.apiKey}`,
  SEND_NOTIFICATION:'https://fcm.googleapis.com/fcm/send',
  WEB_URL:  "https://pharmawize-dev.firebaseapp.com/"
};

const facebookConfig = {
  APP_ID: "562617151222836"
};

const googleConfig = {
  iosClientId:
    "934971820678-jtj88ef1aebctilu8m8rs8olkepnc6ep.apps.googleusercontent.com",
  androidClientId:
    "934971820678-opn2lpvgqqmkds9s3emo7tkc4qhahlub.apps.googleusercontent.com"
};

const firebaseDB = firebase.initializeApp(firebaseConfig).firestore();
const firebaseStorage = firebase.app().storage(firebaseConfig.storageBucket);

export {
  firebase,
  firebaseConfig,
  FIREBASE_API,
  facebookConfig,
  googleConfig,
  firebaseDB,
  firebaseStorage
};
