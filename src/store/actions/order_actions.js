import {
  FIND_USER_ORDERS,
  ADD_USER_ORDER,
  FIND_ORDER,
  UPDATE_ORDER
} from "../types";
import {
  firebaseDB,
  FIREBASE_API,
  firebaseStorage,
  firebaseConfig,
  firebase
} from "../../libs/config";

import axios from "axios";
export const findUserOrders = async email => {
  let orders = [];
  try {
    const querySnapshot = await findUserOrdersInDatabase(email);
    await querySnapshot.forEach(function(doc) {
      const order = doc.data();
      order.id = doc.id;
      order.dueDate = order.dueDate ? order.dueDate.toDate() : null;
      order.finishDate = order.finishDate ? order.finishDate.toDate() : null;
      order.orderDate = order.orderDate ? order.orderDate.toDate() : null;
      if (order.comments && order.comments.length > 0) {
        order.comments.sort(
          (a, b) => a.createdAt.toDate() - b.createdAt.toDate()
        );
      }
      orders.push(order);
    });
    return {
      type: FIND_USER_ORDERS,
      payload: orders
    };
  } catch (error) {
    console.log(error);
    return {
      type: FIND_USER_ORDERS,
      payload: orders
    };
  }
};

export const findOrder = async orderId => {
  try {
    const doc = await firebaseDB
      .collection("prescriptions")
      .doc(orderId)
      .get();
    if (doc.exists) {
      const order = doc.data();
      order.id = doc.id;
      order.dueDate = order.dueDate ? order.dueDate.toDate() : "";
      order.finishDate = order.finishDate ? order.finishDate.toDate() : "";
      order.orderDate = order.orderDate ? order.orderDate.toDate() : "";
      return {
        type: FIND_ORDER,
        payload: {
          success: true,
          order
        }
      };
    } else {
      return {
        type: FIND_ORDER,
        payload: {
          success: false,
          error: "no order found"
        }
      };
    }
  } catch (error) {
    return {
      type: FIND_ORDER,
      payload: {
        payload: {
          success: false,
          error: error
        }
      }
    };
  }
};
export const updateOrder = async order => {
  try {
    await updateOrderComments(order);
    return {
      type: UPDATE_ORDER,
      payload: {
        success: true,
        error:null
      }
    };
  } catch (error) {
    return {
      type: UPDATE_ORDER,
      payload: {
        payload: {
          success: false,
          error: error
        }
      }
    };
  }
};
export const findUserOrdersInDatabase = email => {
  return firebaseDB
    .collection("prescriptions")
    .where("email", "==", email)
    .get();
};
export const updateOrderComments = order => {
  const id = order.id;
  delete order.id;
  return firebaseDB
    .collection("prescriptions")
    .doc(id)
    .update(order);
};

export const addUserOrder = async (prescItem, email, imagePath) => {
  try {
    const imageCloudPath = await addImageToCloudStorage(email, imagePath);

    const orderDate = new Date();
    const data = {
      refNo: null,
      email: email,
      pharmacyId: prescItem.pharmacyId,
      dueDate: prescItem.dueDate,
      finishDate: null,
      orderDate: orderDate,
      status: prescItem.status,
      type: prescItem.type,
      extractedText: null,
      patientComments: prescItem.comments,
      pharmacyComments: null,
      imageCloudPath: imageCloudPath
    };

    var prescID = "temp";

    const test = await firebaseDB
      .collection("config")
      .doc("counter")
      .get();
    const newRefNumber = test.data().refNumber + 1;

    await firebaseDB
      .collection("prescriptions")
      .add(data)
      .then(function(docRef) {
        prescID = docRef.id;
      })
      .catch(error => {
        console.log("Unable to add to prescription collection: ", error);
      });

    return {
      type: ADD_USER_ORDER,
      payload: {
        id: prescID,
        data: data,
        refNum: newRefNumber
      }
    };
  } catch (error) {
    console.log(error);
    return {
      type: ADD_USER_ORDER,
      payload: {
        error: "Unable to add order"
      }
    };
  }
};

// const Blob = RNFetchBlob.polyfill.Blob
// const fs = RNFetchBlob.fs
export const uriToBlob = uri => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function() {
      reject(new Error("uriToBlob failed"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};

export const addImageToCloudStorage = (email, imagePath) => {
  return new Promise((resolve, reject) => {
    const fileType = imagePath.split(".").pop(); //get the file type
    const fileName = imagePath.split("/").pop(); //get the file name
    const mime = `image/${fileType}`;

    var metadata = {
      contentType: mime
    };

    var storageRef = firebaseStorage.ref();
    // const imageRef = storageRef.child(`${email}/images/` + fileName);

    uriToBlob(imagePath).then(uploadBlob => {
      var uploadTask = storageRef
        .child(`${email}/images/` + fileName)
        .put(uploadBlob, metadata);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = parseFloat(
            (parseFloat(snapshot.bytesTransferred) /
              parseFloat(snapshot.totalBytes)) *
              100.0
          );

          console.log(progress + "% done");

          //console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              //console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              //console.log('Upload is running');
              break;
          }
        },
        function(error) {
          switch (error.code) {
            case "storage/unauthorized":
              console.log("User doesn't have permission to access the object");
              reject(error);

            case "storage/canceled":
              console.log("User doesn't have permission to access the object");
              reject(error);

            case "storage/unknown":
              console.log(
                "Unknown error occurred, inspect error.serverResponse"
              );
              reject(error);
          }
        },
        function() {
          uploadBlob.close(); //releases blob (file) after uploaded

          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  });
};
export const sendNotification = async data => {
  try {
    const doc = await firebaseDB
      .collection("pharmacies")
      .doc(data.pharmacyId)
      .get();
    if (doc.data().notificationToken) {
      const request = {
        method: "POST",
        url: FIREBASE_API.SEND_NOTIFICATION,
        data: {
          notification: {
            title: "Pharmawize Dev",
            body: data.message,
            click_action: data.orderId
              ? `${FIREBASE_API.WEB_URL}orders/${data.orderId}`
              : FIREBASE_API.WEB_URL
          },
          to: doc.data().notificationToken
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${firebaseConfig.serverKey}`
        }
      };
     await axios(request);
    }
  } catch (error) {
    console.log(error);
  }
};
