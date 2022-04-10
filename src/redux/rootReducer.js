import { combineReducers } from "redux";
import { navigationReducer } from "./navigationReducer";
import { authReducer } from "./authReducer";
import { settingsReducer } from "./settingsReducer";

export const rootReducer = combineReducers({
    navigationReducer, authReducer, settingsReducer
})