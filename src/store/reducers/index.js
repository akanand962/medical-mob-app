import { combineReducers } from "redux";

import User from "./user_reducer";
import Order from "./order_reducer";

const rootreducer = combineReducers({
  User, Order
});

export default rootreducer;
