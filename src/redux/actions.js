import { ADD_TABLE, CATEGORIES_LOAD, OPEN_TABLE, TABLES_LOAD, OPEN_CATEGORY, LOGIN } from "./types";
import axios from 'axios'
import bcrypt from "bcryptjs";

export function openTable(table) {
    return async dispatch => {

        if (table.SystemTableName) {
            try {
                const { data }  = await axios.get(process.env.REACT_APP_ARTCASTA_API+'table/'+table.TableId);
                dispatch({
                    type: OPEN_TABLE,
                    table: data
                });
               
            } catch (error) {
                dispatch({
                    type: OPEN_TABLE,
                    table: table
                });
            }
        } else {
            dispatch({
                type: OPEN_TABLE,
                table: table
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

export function tablesLoad() {
    return async dispatch => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_ARTCASTA_API+'table');
            // const data = [
            //     {
            //         tableName: 'Company'
            //     },
            //     {
            //         tableName: 'Project2'
            //     }
            // ];
            dispatch({
                type: TABLES_LOAD,
                tables: data
            });
        } catch (error) {
            console.log('tablesLoad > ', error);
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
            const { data } = await axios.get(process.env.REACT_APP_ARTCASTA_API+'category');
            dispatch({
                type: CATEGORIES_LOAD,
                categories: data
            });
        } catch (error) {
            console.log('categoriesLoad > ', error);
            dispatch({
                type: CATEGORIES_LOAD,
                categories: []
            });
        }
    }
}

export function login(name, pwd, hashedPwd) {
    return async dispatch => {
        try {
            // let user = {
            //     Username: name,
            //     Password: hashedPwd,
            //     RoleId: 1
            // }
            //axios.post(process.env.REACT_APP_ARTCASTA_API+'login/user',user);
            const { data } = await axios.get(process.env.REACT_APP_ARTCASTA_API + 'login/' + name);
            if (bcrypt.compareSync(pwd, data.Password)) {
                console.log('YESSS');
                dispatch({
                    type: LOGIN,
                    user: data,
                    loggedIn: 1
                });
            }
            else {
                console.log('no( ');
                dispatch({
                    type: LOGIN,
                    user: {},
                    loggedIn: 0
                });
            }
        } catch (error) {
            console.log('login > ', error);
            dispatch({
                type: LOGIN,
                user: {},
                loggedIn: 0
            });
        }
    }
}

export function logout() {
    return {
        type: LOGIN,
        user: {},
        loggedIn: 0
    }
}