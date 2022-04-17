import { TABLES_LOAD, CATEGORIES_LOAD, OPEN_CATEGORY, OPEN_TABLE, SELECT_ROW, LOADING_STATE, UPDATE_CATEGORIES } from './types'

const initialState = {
    categories: [],
    currentCategory: {},
    allTables: [],
    tables: [],
    currentTable: {},
    currentRow: {},
    isLoading: 0
}

export const navigationReducer = (state = initialState, action) => {
    switch (action.type) {
        case CATEGORIES_LOAD:
            return {
                ...state,
                categories: action.categories,
                currentCategory: (window.location.pathname === '/' && state?.currentCategory && Object.keys(state.currentCategory).length === 0 && action.categories.length > 0) ? action.categories[0] : state.currentCategory
                // currentCategory: action.categories.length > 0 ? action.categories[0] : {}
            }
        case TABLES_LOAD:
            return {
                ...state,
                allTables: action.tables,
                tables: action.tables.filter(table => table.CategoryId === state.currentCategory?.CategoryId),
                currentTable:
                    (state.currentTable?.CategoryId === state.currentCategory?.CategoryId && action.tables.find(table => table.TableId === state.currentTable?.TableId))
                        ? state.currentTable
                        : action.tables.find(table => table.CategoryId === state.currentCategory?.CategoryId)
            }
        case OPEN_CATEGORY:
            return {
                ...state,
                currentCategory: action.category,
                tables: state.allTables.filter(table => table.CategoryId === action.category?.CategoryId)
            }
        case OPEN_TABLE:
            return {
                ...state,
                currentTable: action.table
            }
        case SELECT_ROW:
            return {
                ...state,
                currentRow: action.row
            }
        case LOADING_STATE:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: action.categories
            }
        default:
            return state;
    }
}