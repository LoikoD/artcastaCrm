import { TABLES_LOAD, CATEGORIES_LOAD, OPEN_CATEGORY, OPEN_TABLE, LOGIN, REFRESH, INIT_LOCATION, SELECT_ROW } from './types'

// function getCategoryByName(categoryName) {
//     return {
//         CategoryName: categoryName
//     }
// }


const initialState = {
    categories: [],
    currentCategory: {},
    allTables: [],
    tables: [],
    currentTable: {},
    user: {},
    loggedIn: 0,
    accessToken: "",
    firstLoad: 1,
    currentRow: {}
}

export const navigationReducer = (state = initialState, action) => {
    switch(action.type) {
        case CATEGORIES_LOAD:
            return {
                ...state,
                categories: action.categories,
                currentCategory: (Object.keys(state.currentCategory).length === 0 && action.categories.length > 0) ? action.categories[0] : state.currentCategory
               // currentCategory: action.categories.length > 0 ? action.categories[0] : {}
            }  
        case TABLES_LOAD:
            return {
                ...state,
                allTables: action.tables,
                tables: action.tables.filter(table => table.CategoryId === state.currentCategory.CategoryId),
                currentTable: action.tables.find(table => table.CategoryId === state.currentCategory.CategoryId)

            }        
        case OPEN_CATEGORY:
            return {
                ...state,
                currentCategory: action.category,
                tables: state.allTables.filter(table => table.CategoryId === action.category.CategoryId)
            }    
        case OPEN_TABLE:
            return {
                ...state,
                currentTable: action.table
            }
        case LOGIN:
            console.log('LOGIN');
            return {
                ...state,
                user: action.user,
                loggedIn: action.loggedIn,
                accessToken: action.accessToken,
                firstLoad: action.firstLoad
            }
        case REFRESH:
            console.log('REFRESH');
            return {
                ...state,
                accessToken: action.accessToken,
                loggedIn: action.accessToken ? 1 : 0
            }
        case INIT_LOCATION:
            console.log('INIT_LOCATION');
            return {
                ...state,
                initLocation: action.initLocation
            }
        case SELECT_ROW:
            console.log('SELECT_ROW');
            return {
                 ...state,
                currentRow: action.row
            }
        default:
            return state;
    }  
}