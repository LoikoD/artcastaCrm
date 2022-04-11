import { combineReducers } from "redux";
import { navigationReducer } from "./navigationReducer";
import { authReducer } from "./authReducer";
import { settingsReducer } from "./settingsReducer";
import { configureReducer } from "./configureReducer";

export const rootReducer = combineReducers({
    navigationReducer, authReducer, settingsReducer, configureReducer
})