import { CATEGORIES_LOAD, OPEN_TABLE, TABLES_LOAD, OPEN_CATEGORY, LOGIN, REFRESH, INIT_LOCATION, SELECT_ROW, LOADING_STATE, SELECT_SETTINGS_MENU } from "./types";
import { axiosPrivate } from "../api/axios";


export function openTable(table) {
    return async dispatch => {

        if (table?.SystemTableName) {
            try {
                const response = await axiosPrivate.get('table/' + table.TableId);
                dispatch({
                    type: OPEN_TABLE,
                    table: response?.data
                });

            } catch (error) {
                dispatch({
                    type: OPEN_TABLE,
                    table
                });
            }
        } else {
            dispatch({
                type: OPEN_TABLE,
                table
            });
        }
    }
}

export function openCategory(category) {
    return {
        type: OPEN_CATEGORY,
        category
    }
}

export function setLoadingState(isLoading) {
    return {
        type: LOADING_STATE,
        isLoading
    }
}

export function tablesLoad() {
    return async dispatch => {
        try {
            const { data } = await axiosPrivate.get('table');
            dispatch({
                type: TABLES_LOAD,
                tables: data
            });
        } catch (error) {
            dispatch({
                type: TABLES_LOAD,
                tables: []
            });
        }
    }
}

export function categoriesLoad() {
    return async dispatch => {
        try {
            const { data } = await axiosPrivate.get('category');
            dispatch({
                type: CATEGORIES_LOAD,
                categories: data
            });
        } catch (error) {
            dispatch({
                type: CATEGORIES_LOAD,
                categories: []
            });
        }
    }
}

export function login(user, accessToken) {
    return {
        type: LOGIN,
        user,
        accessToken,
        loggedIn: user ? 1 : 0,
        firstLoad: 0
    }
}

export function logout() {
    return async dispatch => {
        try {
            console.log("logout >");
            await axiosPrivate.delete('token');
            dispatch({
                type: LOGIN,
                user: {},
                accessToken: "",
                loggedIn: 0
            });
        } catch (error) {
        }
    }
}

export function refreshAction(accessToken) {
    return {
        type: REFRESH,
        accessToken
    }
}

export function tryLogin() {
    return async dispatch => {
        try {
            const { data } = await axiosPrivate.get('token/refresh');
            dispatch(login(data.User, data.AccessToken));
        } catch (error) {
            dispatch(login(null, ""));
        }
    }
}

export function setInitLocation(initLocation) {
    return {
        type: INIT_LOCATION,
        initLocation
    }
}

export function selectRow(row) {
    return {
        type: SELECT_ROW,
        row
    }
}

export function selectSettingsMenu(selectedMenu) {
    return {
        type: SELECT_SETTINGS_MENU,
        selectedMenu
    }
}

export function saveRow(tableId, rowId, rowData) {
    return async dispatch => {
        try {
            await axiosPrivate.put(`table/${tableId}/row/${rowId}`, rowData);
            dispatch(selectRow(rowData));
            return 1;
        } catch (error) {
            return 0;
        }
    }
}

export async function addRow(tableId, rowData) {
    try {
        await axiosPrivate.post(`table/${tableId}/row`, rowData);
        return 1;
    } catch (error) {
        return 0;
    }
}

export async function deleteRow(tableId, rowId) {
    try {
        await axiosPrivate.delete(`table/${tableId}/row/${rowId}`);
        return 1;
    } catch (error) {
        return 0;
    }
}