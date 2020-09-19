import {
  FIND_USER_ORDERS,
  ADD_USER_ORDER,
  FIND_ORDER,
  UPDATE_ORDER
} from "../types";
import Prescription from "../../models/Prescriptions";

export default function(state = {}, action) {
  switch (action.type) {
    case FIND_ORDER:
      return {
        ...state,
        order: action.payload.order,
        success: action.payload.success,
        error: action.payload.error
      };
    case FIND_USER_ORDERS:
      //need to find a better way to keep list sorted (takes too long)
      let copiedOrders = action.payload;
      let sortedOrders = copiedOrders.sort((a, b) =>
        a.orderDate > b.orderDate ? -1 : 1
      );

      return {
        ...state,
        orders: sortedOrders
      };
    case UPDATE_ORDER:
      return {
        ...state,
        success: action.payload.success,
        error: action.payload.error
      };
    case ADD_USER_ORDER:
      const newPrescription = new Prescription(
        action.payload.id,
        action.payload.data.email,
        action.payload.data.pharmacyId,
        action.payload.data.orderDate,
        action.payload.data.status,
        action.payload.data.type,
        action.payload.data.dueDate,
        action.payload.data.finishDate,
        action.payload.data.extractedText,
        action.payload.data.patientComments,
        action.payload.data.pharmacyComments,
        action.payload.data.imageCloudUrl,
        action.payload.refNum
      );
      let ordersCpy = state.orders;
      ordersCpy.push(newPrescription);
      return {
        ...state,
        orders: ordersCpy
      };
    default:
      return state;
  }
}
