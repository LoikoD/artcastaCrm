import { TABLES_LOAD, CATEGORIES_LOAD, OPEN_CATEGORY, OPEN_TABLE } from './types'

// function getCategoryByName(categoryName) {
//     return {
//         CategoryName: categoryName
//     }
// }

const initialState = {
    categories: [],
    // currentCategory: window.location.pathname.split('/')[1] == 'category' ? getCategoryByName(window.location.pathname.split('/')[2]) : {},
    currentCategory: {},
    allTables: [],
    tables: [],
    currentTable: {}
}

export const navigationReducer = (state = initialState, action) => {
    switch(action.type) {
        case CATEGORIES_LOAD:
            return {
                ...state,
                categories: action.categories,
                currentCategory: action.categories.length > 0 && window.location.pathname == "/" ? action.categories[0] : {}
            }  
        case TABLES_LOAD:
            return {
                ...state,
                allTables: action.tables,
                tables: action.tables.filter(table => table.CategoryId == state.currentCategory.CategoryId),
                currentTable: action.tables.find(table => table.CategoryId == state.currentCategory.CategoryId)

            }        
        case OPEN_CATEGORY:
            return {
                ...state,
                currentCategory: action.category,
                tables: state.allTables.filter(table => table.CategoryId == action.category.CategoryId)
            }    
        case OPEN_TABLE:
            return {
                ...state,
                currentTable: action.table
                }
        default:
            return state;
    }  
}