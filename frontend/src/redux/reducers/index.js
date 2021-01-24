import currentUserReducer from "./currentUser";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  currentUser: currentUserReducer,
});

export default allReducers;
