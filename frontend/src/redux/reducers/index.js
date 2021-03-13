import currentUserReducer from "./currentUser";
import isAdminReducer from "./isAdmin";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  currentUser: currentUserReducer,
  isAdmin: isAdminReducer,
});

export default allReducers;
