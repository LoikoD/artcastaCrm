import { combineReducers } from "redux";
import { navigationReducer } from "./navigationReducer";
import { authReducer } from "./authReducer";
import { settingsReducer } from "./settingsReducer";
import { configureReducer } from "./configureReducer";
import { rolesReducer } from "./rolesReducer";
import { usersReducer } from "./usersReducer";

export const rootReducer = combineReducers({
    navigationReducer, authReducer, settingsReducer, configureReducer, rolesReducer, usersReducer
})