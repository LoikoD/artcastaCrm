import { combineReducers } from "redux";
import { navigationReducer } from "./navigationReducer";
import { authReducer } from "./authReducer";

export const rootReducer = combineReducers({
    navigationReducer, authReducer
})